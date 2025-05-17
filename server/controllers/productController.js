import { Product, Rating } from "../model/model.js"
import { deleteDriveFiles, deleteLocalFiles, postDriveFiles } from "../services/googleDriveServices.js"

class ProductController {
    async createProduct(req, res) {

        const { name, price, discount, compound, warp, hight, hardness, size, description, from, catalogId } = req.body
        const files = req.files
        const userId = req.user.id

        if (req.user.role !== "ADMIN") {
            await deleteLocalFiles(files)

            return res.status(403).json({ message: "Доступа запрещен" })

        }

        try {

            if (!name || !from || !price || !compound || !warp || !hight || !hardness || !size || !description || !catalogId) {
                await deleteLocalFiles(files)

                return res.status(400).json({ message: "Не все поля заполнены" })
            }

            if (description.trim().length < 100) {
                await deleteLocalFiles(files)

                return res.status(406).json({ message: "Описание не может быть меньше чем 100 симолов" })
            }

            if (files.length === 0) {
                await deleteLocalFiles(files)

                return res.status(406).json({ message: "Не все поля заполнены" })
            }

            const imageUrls = await postDriveFiles(files)


            const sizeArray = typeof size === "string" ? size.split(" ") : Array.isArray(size) ? size : []

            const sizes = sizeArray.map(size => {
                const [w, l] = size.split("x").map(Number)

                const squareMeters = w * l

                const total = Math.round(price * squareMeters)

                return { size, total, squareMeters }
            })

            const product = await Product.create({ userId, img: imageUrls, name, price, discount, compound, warp, hight, hardness, size: sizes.map(s => s.size), description, from, catalogId })

            deleteLocalFiles(files)

            return res.status(201).json({ product, message: "Товар успешно создан" })
        } catch (err) {
            console.error(err)
            await deleteLocalFiles(files)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async getAllProducts(req, res) {
        try {
            const offset = parseInt(req.query.offset) || 0
            const limit = 12

            const { count, rows: products } = await Product.findAndCountAll({ limit, offset, order: [["createdAt", "DESC"]] })

            const hasMore = offset + limit < count
            const nextOffset = hasMore ? offset + limit : null


            return res.status(200).json({ products, hasMore, nextOffset })
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
        const files = req.files || []
        const userId = req.user.id

        if (req.user.role !== "ADMIN") {
            await deleteLocalFiles(files)
            return res.status(403).json({ message: "Доступа запрещен" })
        }

        try {

            if (!id) {
                await deleteLocalFiles(files)
                return res.status(404).json({ message: "Такого товара не существует" })
            }

            const product = await Product.findByPk(id, {
                include: [{
                    model: Rating,
                    as: "Ratings"
                }]
            })

            if (!product) {
                await deleteLocalFiles(files)
                return res.status(404).json({ message: "Такого товара не существует" })
            }

            const allFile = [
                ...(product.img || []),
                ...(product.Ratings?.flatMap(rating => rating.img) || [])
            ]

            await Promise.all([
                deleteDriveFiles(allFile),
                deleteLocalFiles(files),

                Rating.destroy({ where: { productId: id }, individualHooks: true })
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
        const { name, price, discount, compound, warp, hight, hardness, size, description, from, catalogId } = req.body
        const files = req.files
        const userId = req.user.id

        if (req.user.role !== "ADMIN") {
            await deleteLocalFiles(files)
            return res.status(403).json({ message: "Доступа запрещен" })
        }

        try {
            let product = await Product.findByPk(id)

            if (!id) {
                await deleteDriveFiles(files)
                return res.status(404).json({ message: "Такого товара не существует" })
            }

            if (!files || files.length === 0) {
                await deleteLocalFiles(files)
                return res.status(401).json({ message: "Не все поля заполнены" })
            }

            if (!name || !from || !price || !compound || !warp || !hight || !hardness || !size || !description) {
                await deleteLocalFiles(files)
                return res.status(400).json({ message: "Не все поля заполнены" })
            }

            if (description.trim().length < 100) {
                await deleteLocalFiles(files)
                return res.status(406).json({ message: "Описание не может быть меньше чем 100 симолов" })
            }

            let imageUrls = product.img || []

            if (files?.length > 0) {
                try {

                    if (product.img?.length > 0) {
                        await deleteDriveFiles(product.img)
                    }

                    imageUrls = await postDriveFiles(files)

                } catch (err) {
                    console.error("Ошибка загрузки файлов:", err)
                    await deleteLocalFiles(files)
                    return res.status(500).json({ message: "Ошибка при обновлении изображений" })
                }
            }

            const sizeArray = typeof size === "string" ? size.split(" ") : Array.isArray(size) ? size : []

            product = await Product.update({ userId, img: imageUrls, name, price, discount, compound, warp, hight, hardness, size: sizeArray, description, from, catalogId }, { where: { id } })

            await deleteLocalFiles(files)

            const productUpdate = await Product.findOne({ where: { id } })

            return res.status(200).json({ productUpdate, message: "Товар успешно обновлен" })

        } catch (err) {
            console.error(err)
            await deleteLocalFiles(files)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }
}

export default new ProductController()