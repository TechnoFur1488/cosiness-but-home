import { CartProduct, ForeverProduct, Product, Rating } from "../model/model.js"
import { deleteDriveFiles, deleteLocalFiles, postDriveFiles } from "../services/googleDriveServices.js"
import "dotenv"
import { totalPrice } from "../utils/totalPrice.js"

const uploadProductImg = process.env.GOOGLE_DRIVE_PRODUCT_PHOTO

class ProductController {
    async createProduct(req, res) {

        const { name, price, discount, compound, warp, hight, hardness, size, description, from, catalogId } = req.body
        const files = req.files
        const userId = req.user.id


        if (req.user.role !== "ADMIN") {
            await deleteLocalFiles()
            return res.status(403).json({ message: "Доступа запрещен" })
        }

        try {

            if (!name || !from || !price || !compound || !warp || !hight || !hardness || !size || !description || !catalogId) {
                await deleteLocalFiles()
                return res.status(400).json({ message: "Не все поля заполнены" })
            }

            if (files.length === 0) {
                await deleteLocalFiles()
                return res.status(406).json({ message: "Не все поля заполнены" })
            }

            let imageUrls = await postDriveFiles(files, uploadProductImg)

            if (imageUrls.length === 0) {
                await deleteLocalFiles()
                return res.status(500).json({ message: "Ошибка сервера" })
            }

            const sizeArray = typeof size === "string" ? size.split(" ") : Array.isArray(size) ? size : []

            const sizes = sizeArray.map(size => {
                const [w, l] = size.split("x").map(Number)

                const squareMeters = w * l

                const total = Math.round(price * squareMeters)

                return { size, total, squareMeters }
            })

            const product = await Product.create({ userId, img: imageUrls, name, price, discount, compound, warp, hight, hardness, size: sizes.map(s => s.size), description: description.trim(), from, catalogId })

            await deleteLocalFiles()

            return res.status(201).json({ product, message: "Товар успешно создан" })
        } catch (err) {
            console.error(err)
            await deleteLocalFiles()
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async getAllProducts(req, res) {
        try {
            const offset = parseInt(req.query.offset) || 0
            const limit = 15

            const { count, rows: products } = await Product.findAndCountAll({ limit, offset, order: [["createdAt", "DESC"]] })

            const hasMore = offset + limit < count
            const nextOffset = hasMore ? offset + limit : null


            return res.status(200).json({ products, hasMore, nextOffset })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async getNewProducts(req, res) {
        const limit = 4

        try {
            const products = await Product.findAll({ limit, order: [["createdAt", "DESC"]] })

            return res.status(200).json({ products })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async getOneProducts(req, res) {

        const { id } = req.params

        try {

            if (!id) {
                return res.status(404).json({ message: "Такого товара не существует" })
            }

            const product = await Product.findByPk(id)

            return res.status(200).json({ product })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async deleteProduct(req, res) {

        const { id } = req.params
        const userId = req.user.id

        if (req.user.role !== "ADMIN") {
            await deleteLocalFiles()
            return res.status(403).json({ message: "Доступа запрещен" })
        }

        try {

            if (!id) {
                await deleteLocalFiles()
                return res.status(404).json({ message: "Такого товара не существует" })
            }

            const product = await Product.findByPk(id, {
                include: [{
                    model: Rating,
                    as: "Ratings"
                }]
            })

            if (!product) {
                await deleteLocalFiles()
                return res.status(404).json({ message: "Такого товара не существует" })
            }

            const allFile = [
                ...(product.img || []),
                ...(product.Ratings?.flatMap(rating => rating.img) || [])
            ]

            await Promise.all([
                deleteDriveFiles(allFile),
                deleteLocalFiles(),
            ])

            await product.destroy({ userId })

            return res.status(200).json({ message: "Товар успешно удален" })
        } catch (err) {
            console.error(err)

            try {
                await deleteLocalFiles(req.files || [])
            } catch (fileErr) {
                console.error("Ошибка упри удалении временных файлов", fileErr)
            }

            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async updateProduct(req, res) {

        const { id } = req.params
        const { name, price, discount, compound, warp, hight, hardness, size, description, from, catalogId, existingImg } = req.body
        const files = req.files
        const userId = req.user.id

        if (req.user.role !== "ADMIN") {
            await deleteLocalFiles()
            return res.status(403).json({ message: "Доступа запрещен" })
        }

        try {

            const existingImages = existingImg ? JSON.parse(existingImg) : []
            const newFilesCount = files ? files.length : 0
            const totalImgCount = existingImages.length + newFilesCount

            if (totalImgCount > 10) {
                await deleteLocalFiles()
                return res.status(400).json({ message: "Максимум 10 фото" })
            }

            let product = await Product.findByPk(id)

            if (!id) {
                await deleteDriveFiles(files)
                return res.status(404).json({ message: "Такого товара не существует" })
            }

            if ((!existingImages || existingImages.length === 0) && (!files || files.length === 0)) {
                await deleteLocalFiles()
                return res.status(401).json({ message: "Не все поля заполнены" })
            }

            if (!name || !from || !price || !compound || !warp || !hight || !hardness || !size || !description || !catalogId) {
                await deleteLocalFiles()
                return res.status(400).json({ message: "Не все поля заполнены" })
            }

            const cartItem = await CartProduct.findAll({ where: { productId: id } })
            const removedItems = []

            if (cartItem.length > 0) {
                const newSizes = Array.isArray(size) ? size : typeof size === "string" ? size.split(" ") : []

                const normalizedNewSize = newSizes.map(s => {
                    if (!s) return null
                    return s.replace(/\s/g, "").toLowerCase().split("x").join("x")
                })

                await Promise.all(cartItem.map(async (item) => {
                    const itemSize = item.size
                    const normalizedItemSize = itemSize ? itemSize.replace(/\s/g, "").toLowerCase().split("X").join("x") : null

                    const sizeExistsInProduct = normalizedNewSize.includes(normalizedItemSize)

                    if (!sizeExistsInProduct) {
                        await CartProduct.destroy({ where: { id: item.id } })
                        removedItems.push(item.id)
                    } else {
                        const quantity = Number(item.quantity)
                        const itemPrice = Number(price)
                        const itemDiscount = Number(discount)

                        const totalPriceProduct = totalPrice({ size: itemSize, price: itemPrice, quantity })
                        const totalDiscountProduct = totalPrice({ size: itemSize, price: itemDiscount, quantity })

                        await CartProduct.update({ total: totalPriceProduct, totalDiscount: totalDiscountProduct }, { where: { id: item.id } })
                    }
                }))
            }

            let imageUrls = product.img

            const imgToDelete = imageUrls.filter(url => !existingImages.includes(url))

            if (imgToDelete.length > 0) {
                try {
                    await deleteDriveFiles(imageUrls)
                } catch (err) {
                    console.error("Ошибка при удалении файлов:", err)
                    await deleteLocalFiles()
                    return res.status(500).json({ message: "Ошибка при обновлении изображений" })
                }
            }

            if (existingImg) {
                imageUrls = existingImages
            }

            let newImgUrls = []
            if (files && files.length > 0) {
                try {
                    newImgUrls = await postDriveFiles(files, uploadProductImg)
                } catch (err) {
                    console.error("Ошибка загрузки файлов:", err)
                    await deleteLocalFiles()
                    return res.status(500).json({ message: "Ошибка при загрузке новых изображений" })
                }
            }

            const allImg = [...imageUrls, ...newImgUrls]

            const sizeArray = typeof size === "string" ? size.split(" ") : Array.isArray(size) ? size : []

            product = await Product.update({ userId, img: allImg, name, price, discount, compound, warp, hight, hardness, size: sizeArray, description: description.trim(), from, catalogId }, { where: { id } })

            const productUpdate = await Product.findOne({ where: { id } })

            await deleteLocalFiles()

            return res.status(200).json({ productUpdate, message: "Товар успешно обновлен" })

        } catch (err) {
            console.error(err)
            await deleteLocalFiles()
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }
}

export default new ProductController()