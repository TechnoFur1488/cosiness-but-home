import { Catalog, Product, Rating } from "../model/model.js"
import { deleteDriveFiles, deleteLocalFiles, postDriveFiles } from "../services/googleDriveServices.js"
import "dotenv"

const uploadCatalogImg = process.env.GOOGLE_DRIVE_CATALOG_PHOTO

class CatalogController {
    async create(req, res) {
        const { name } = req.body
        const files = req.files
        const userId = req.user.id

        if (req.user.role !== "ADMIN") {
            await deleteLocalFiles()
            return res.status(403).json({ message: "Доступа запрещен" })
        }

        try {

            if (!name) {
                return res.status(400).json({ message: "Не все поля заполнены" })
            }

            if (files.length === 0) {
                await deleteLocalFiles()
                return res.status(406).json({ message: "Не все поля заполнены" })
            }

            let imageUrls = await postDriveFiles(files, uploadCatalogImg)

            if (imageUrls.length === 0) {
                await deleteLocalFiles()
                return res.status(500).json({ message: "Ошибка сервера" })
            }

            const catalog = await Catalog.create({ userId, name, img: imageUrls })

            await deleteLocalFiles()

            return res.status(201).json({ catalog, message: "Каталог успешно создан" })
        } catch (err) {
            console.error(err)
            await deleteLocalFiles()
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async getAllCatalog(req, res) {
        try {
            const catalogs = await Catalog.findAll({ order: [["createdAt", "DESC"]] })
            return res.status(200).json({ catalogs })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async getOneCatalog(req, res) {
        const { id } = req.params

        try {
            const catalog = await Catalog.findOne({ where: { id }, attributes: ["name"] })
            return res.status(200).json({ catalog })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async updateCatalog(req, res) {
        const { id } = req.params
        const { name, existingImg } = req.body
        const files = req.files

        if (req.user.role !== "ADMIN") {
            await deleteLocalFiles()
            return res.status(403).json({ message: "Доступа запрещен" })
        }

        try {

            const existingImages = existingImg ? JSON.parse(existingImg) : []
            const newFilesCount = files ? files.length : 0
            const totalImgCount = existingImages.length + newFilesCount

            let catalog = await Catalog.findByPk(id)

            if (totalImgCount > 1) {
                await deleteLocalFiles()
                return res.status(400).json({ message: "Максимум 1 фото" })
            }

            if ((!existingImages || existingImages.length === 0) && (!files || files.length === 0)) {
                await deleteLocalFiles()
                return res.status(401).json({ message: "Не все поля заполнены" })
            }

            if (!id) {
                return res.status(404).json({ message: "Такого каталога не существует" })
            }

            if (!name) {
                return res.status(406).json({ message: "Не все поля заполнены" })
            }

            let imageUrls = catalog.img

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
                    newImgUrls = await postDriveFiles(files, uploadCatalogImg)
                } catch (err) {
                    console.error("Ошибка загрузки файлов:", err)
                    await deleteLocalFiles()
                    return res.status(500).json({ message: "Ошибка при загрузке новых изображений" })
                }
            }

            const allImg = [...imageUrls, ...newImgUrls]

            await Catalog.update({ name, img: allImg }, { where: { id } })

            await deleteLocalFiles()

            const catalogResult = await Catalog.findByPk(id) 

            return res.status(200).json({catalogResult, message: "Каталог успешно обновлен" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async deleteCatalog(req, res) {
        const { id } = req.params
        const userId = req.user.id

        if (req.user.role !== "ADMIN") {
            await deleteLocalFiles()
            return res.status(403).json({ message: "Доступа запрещен" })
        }

        try {

            if (!id) {
                return res.status(404).json({ message: "Такого каталога не существует" })
            }

            const catalog = await Catalog.findByPk(id, {
                include: [{
                    model: Product,
                    as: "Products",
                    include: [{
                        model: Rating,
                        as: "Ratings"
                    }]
                }]
            })

            const allFile = [
                ...(catalog.img || []),
                ...(catalog.Products?.flatMap(product => product.img) || []),
                ...(catalog.Products?.flatMap(product => product.Ratings?.flatMap(rating => rating.img) || []) || [])
            ]
            
            await Promise.all([
                deleteDriveFiles(allFile),
                deleteLocalFiles(),
            ])

            await catalog.destroy({ where: { id }, userId })

            return res.status(200).json({ message: "Каталог успешно удален" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async getAllCatalogProducts(req, res) {
        try {
            const { catalogId } = req.params

            const offset = parseInt(req.query.offset) || 0
            const limit = 15

            if (!catalogId) {
                return res.status(404).json({ message: "Такого каталога не существует" })
            }

            const { count, rows: products } = await Product.findAndCountAll({ where: { catalogId }, limit, offset, order: [["createdAt", "DESC"]] })

            const hasMore = offset + limit < count
            const nextOffset = hasMore ? offset + limit : null

            return res.status(200).json({ products, hasMore, nextOffset })

        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }
}

export default new CatalogController()