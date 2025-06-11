import { Rating, Product } from "../model/model.js"
import { deleteDriveFiles, deleteLocalFiles, postDriveFiles } from "../services/googleDriveServices.js"
import "dotenv"

const uploadRatingImg = process.env.GOOGLE_DRIVE_RATING_PHOTO
class RatingController {
    async createRating(req, res) {
        const { productId } = req.params
        const { name, grade, gradeText } = req.body;
        const sessionId = req.sessionId;
        const files = req.files || []

        try {

            if (gradeText.length > 1000) {
                await deleteLocalFiles()
                return res.status(400).json({ message: "Описание не может привышать больше 1000 символов" })
            }

            if (!name || !grade) {
                await deleteLocalFiles()
                return res.status(400).json({ message: "Не все поля заполнены" })
            }

            if (grade > 5 || grade < 1 || grade === 0) {
                await deleteLocalFiles()
                return res.status(400).json({ message: "Оценка должна быть от 1 до 5" })

            }

            const product = await Product.findByPk(productId)

            if (!product) {
                await deleteLocalFiles()
                return res.status(404).json({ message: "Продукт не найден" })
            }

            const existingRating = await Rating.findOne({
                where: {
                    sessionId,
                    productId
                }
            });

            if (existingRating) {
                await deleteLocalFiles()
                return res.status(400).json({ message: "Вы уже оставляли отзыв для этого продукта" });
            }

            const imageUrls = await postDriveFiles(files, uploadRatingImg)

            const ratings = await Rating.create({ name, grade, gradeText: gradeText, img: imageUrls, productId: productId, sessionId })

            await deleteLocalFiles()

            return res.status(201).json({ ratings, message: "Рейтинг успешно создан" })

        } catch (err) {
            console.error(err)
            await deleteLocalFiles()
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async getAllRatingProduct(req, res) {
        const { productId } = req.params

        try {

            if (!productId) {
                return res.status(404).json({ message: "Такого товара не существует" })
            }

            const rating = await Rating.findAll({ where: { productId }, attributes: ["grade"], order: [["createdAt", "DESC"]] })

            return res.status(200).json({ rating })

        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async getAllRatingLazy(req, res) {
        const offset = parseInt(req.query.offset) || 0
        const limit = 10
        const { productId } = req.params

        try {
            const { count, rows: ratings } = await Rating.findAndCountAll({ where: { productId }, limit, offset, order: [["createdAt", "DESC"]] })

            const hasMore = offset + limit < count
            const nextOffset = hasMore ? offset + limit : null

            return res.status(200).json({ ratings, hasMore, nextOffset })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }

    }

    async getAllRating(req, res) {
        const offset = parseInt(req.query.offset) || 0
        const limit = 10

        try {
            const { count, rows: rating } = await Rating.findAndCountAll({ limit, offset, order: [["createdAt", "DESC"]] })

            const hasMore = offset + limit < count
            const nextOffset = hasMore ? offset + limit : null

            return res.status(200).json({ rating, hasMore, nextOffset })

        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async getOneMyRating(req, res) {
        const { productId } = req.params
        const sessionId = req.sessionId

        try {
            const myRating = await Rating.findOne({ where: { productId, sessionId } })

            return res.status(200).json({ myRating })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async getOneRating(req, res) {
        const { id } = req.params

        try {

            const rating = await Rating.findByPk(id)

            if (!rating) {
                return res.status(404).json({ message: "Такого рейтинга не существует" })
            }

            return res.status(200).json({ rating })

        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async updateRating(req, res) {

        const { id } = req.params
        const { name, grade, gradeText, existingImg } = req.body
        const files = req.files
        const sessionId = req.sessionId
        const userId = req.user.id

        if (!id) {
            await deleteLocalFiles()
            return res.status(404).json({ message: "Такого рейтинга не существует" })
        }

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

            if (files && files.length > 10) {
                await deleteLocalFiles()
                return res.status(400).json({ message: "Максимум 10 фото" })
            }


            if (!name || !grade) {
                await deleteLocalFiles()
                return res.status(400).json({ message: "Не все поля заполнены" })
            }

            if (grade > 5 || grade < 1 || grade === 0) {
                await deleteLocalFiles()
                return res.status(400).json({ message: "Оценка должна быть от 1 до 5" })
            }

            const checkRole = req.user.role === "ADMIN" ? { id } : { id, sessionId }

            let rating = await Rating.findOne({ where: checkRole })

            if (!rating) {
                await deleteLocalFiles()
                return res.status(404).json({ message: "Вы не можете редактировать этот отзыв или отзыв не найден" })
            }

            let currentImgUrls = rating.img || []

            const imgToDelete = currentImgUrls.filter(url => !existingImages.includes(url))

            if (imgToDelete.length > 0) {
                try {
                    await deleteDriveFiles(imgToDelete)
                } catch (err) {
                    await deleteLocalFiles()
                    console.error("Ошибка при удалении файлов:", err)
                    return res.status(500).json({ message: "Ошибка при обновлении изображений" })
                }
            }

            if (existingImg) {
                currentImgUrls = existingImages
            }

            let newImgUrls = []
            if (files && files.length > 0) {
                try {
                    newImgUrls = await postDriveFiles(files, uploadRatingImg)
                } catch (err) {
                    console.error("Ошибка загрузки файлов:", err)
                    await deleteLocalFiles()
                    return res.status(500).json({ message: "Ошибка при загрузке новых изображений" })
                }
            }

            const allImg = [...currentImgUrls, ...newImgUrls]

            await Rating.update({ userId, name, grade, gradeText, img: allImg }, { where: checkRole })

            const updateRating = await Rating.findOne({ where: { id } })

            await deleteLocalFiles()

            return res.status(200).json({ updateRating, message: "Рейтинг успешно обновлен" })

        } catch (err) {
            console.error(err)
            await deleteLocalFiles()
            return res.status(500).json({ message: "Ошибка сервера" })
        }

    }

    async deleteRating(req, res) {

        const { id } = req.params
        const sessionId = req.sessionId
        const userId = req.user.id

        if (!id) {
            await deleteLocalFiles()
            return res.status(404).json({ message: "Такого рейтинга не существует" })
        }

        if (req.user.role !== "ADMIN") {
            await deleteLocalFiles()
            return res.status(403).json({ message: "Доступа запрещен" })
        }

        try {

            const checkRole = req.user.role === "ADMIN" ? { id } : { id, sessionId }

            const rating = await Rating.findOne({ where: checkRole })

            if (!rating) {
                await deleteLocalFiles()
                return res.status(404).json({ message: "Такого рейтинга не существует или вы не можете его удалить" })
            }

            await Promise.all([
                deleteDriveFiles(rating.img || []),
                deleteLocalFiles()
            ])

            await rating.destroy({ userId })

            return res.status(200).json({ message: "Рейтинг успешно удален" })
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
}

export default new RatingController()