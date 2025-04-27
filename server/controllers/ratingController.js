import path, { dirname, join } from "path"
import { google } from "googleapis"
import fs from "fs"
import { Rating, Product } from "../model/model.js"
import { fileURLToPath } from "url"
import dotenv from "dotenv"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const auth = new google.auth.GoogleAuth({
    keyFile: join(__dirname, "..", "google-credentials.json"),
    scopes: ["https://www.googleapis.com/auth/drive"]
})

const drive = google.drive({ version: "v3", auth })

class RatingController {
    async createRating(req, res) {

        const files = req.files || [];

        try {
            const { productId } = req.params
            const { name, grade, gradeText } = req.body;
            const sessionId = req.sessionId;



            if (!name || !grade) {

                files.forEach(file => {
                    fs.unlinkSync(file.path)
                })

                return res.status(400).json({ message: "Не все поля заполнены" })
            }

            if (grade > 5 || grade < 1 || grade === 0) {

                files.forEach(file => {
                    fs.unlinkSync(file.path)
                })

                return res.status(400).json({ message: "Оценка должна быть от 1 до 5" })

            }

            const product = await Product.findByPk(productId)

            if (!product) {

                files.forEach(file => {
                    fs.unlinkSync(file.path)
                })

                return res.status(404).json({ message: "Продукт не найден" })
            }

            const existingRating = await Rating.findOne({
                where: {
                    sessionId,
                    productId
                }
            });

            if (existingRating) {

                files.forEach(file => {
                    fs.unlinkSync(file.path)
                })

                return res.status(400).json({ message: "Вы уже оставляли отзыв для этого продукта" });
            }

            const imageUrls = await Promise.all(files.map(async (file) => {
                const response = drive.files.create({
                    requestBody: {
                        name: file.originalname || path.basename(file.path),
                        mimeType: file.mimetype,
                        parents: [process.env.GOOGLE_DRIVE_RATING_PHOTO]
                    },
                    media: {
                        mimeType: file.mimetype,
                        body: fs.createReadStream(file.path)
                    }
                })
                drive.permissions.create({
                    fileId: response.data.id,
                    requestBody: {
                        role: "reader",
                        type: "anyone"
                    }
                })

                return `https://drive.google.com/uc?export=view&id=${response.data.id}`
            }))

            files.forEach(file => {
                fs.unlinkSync(file.path)
            })

            const ratings = await Rating.create({ name, grade, gradeText, img: imageUrls, productId: product.id, sessionId })

            return res.status(201).json({ ratings, message: "Рейтинг успешно создан" })

        } catch (err) {
            console.error(err)

            files.forEach(file => {
                fs.unlinkSync(file.path)
            })

            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async getAllRating(req, res) {
        try {

            const { productId } = req.params

            if (!productId) {
                return res.status(404).json({ message: "Такого товара не существует" })
            }

            const rating = await Rating.findAll({ where: { productId } })

            return res.status(200).json({ rating })

        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async updateRating(req, res) {
        try {
            const { id } = req.params
            const { name, grade, gradeText } = req.body
            const files = req.files
            const sessionId = req.sessionId

            if (files > 10) {

                files.forEach(file => {
                    fs.unlinkSync(file.path)
                })

                return res.status(400).json({ message: "Максимум 10 фото" })
            }

            if (!id) {

                files.forEach(file => {
                    fs.unlinkSync(file.path)
                })

                return res.status(404).json({ message: "Такого рейтинга не существует" })
            }

            if (!name || !grade) {

                files.forEach(file => {
                    fs.unlinkSync(file.path)
                })

                return res.status(400).json({ message: "Не все поля заполнены" })
            }

            if (grade > 5 || grade < 1 || grade === 0) {

                files.forEach(file => {
                    fs.unlinkSync(file.path)
                })

                return res.status(400).json({ message: "Оценка должна быть от 1 до 5" })
            }

            let rating = await Rating.findOne({ where: { id, sessionId } })

            if (!rating) {

                files.forEach(file => {
                    fs.unlinkSync(file.path)
                })

                return res.status(404).json({ message: "Вы не можете редактировать этот отзыв или отзыв не найден" })
            }

            await Promise.all(rating.img.map(async (url) => {
                try {
                    const fileId = url.match(/id=([^&]+)/)[1]

                    await drive.files.delete({
                        fileId: fileId
                    })
                } catch (err) {
                    console.error(err)

                    files.forEach(file => {
                        fs.unlinkSync(file.path)
                    })

                    return res.status(500).json({ message: "Ошибка сервера" })
                }
            }))

            const imageUrls = await Promise.all(files.map(async (file) => {
                const response = drive.files.create({
                    requestBody: {
                        name: file.originalname || path.basename(file.path),
                        mimeType: file.mimetype,
                        parents: [process.env.GOOGLE_DRIVE_RATING_PHOTO]
                    },
                    media: {
                        mimeType: file.mimetype,
                        body: fs.createReadStream(file.path)
                    }
                })
                drive.permissions.create({
                    fileId: response.data.id,
                    requestBody: {
                        role: "reader",
                        type: "anyone"
                    }
                })

                return `https://drive.google.com/uc?export=view&id=${response.data.id}`
            }))

            rating = await Rating.update({ name, grade, gradeText, img: imageUrls }, { where: { id, sessionId } })

            files.forEach(file => {
                fs.unlinkSync(file.path)
            })

            const updateRating = await Rating.findOne({ where: { id } })

            return res.status(200).json({ updateRating, message: "Рейтинг успешно обновлен" })

        } catch (err) {
            console.error(err)

            files.forEach(file => {
                fs.unlinkSync(file.path)
            })

            return res.status(500).json({ message: "Ошибка сервера" })
        }

    }

    async deleteRating(req, res) {
        try {
            const { id } = req.params
            const files = req.files
            const sessionId = req.sessionId

            if (!id) {

                files.forEach(file => {
                    fs.unlinkSync(file.path)
                })

                return res.status(404).json({ message: "Такого рейтинга не существует" })
            }

            const rating = await Rating.findOne({ where: { id, sessionId } })

            if (!rating) {

                files.forEach(file => {
                    fs.unlinkSync(file.path)
                })

                return res.status(404).json({ message: "Такого рейтинга не существует или вы не можете его удалить" })
            }

            const imgUrls = rating.img

            await Promise.all(imgUrls.map(async (url) => {
                try {
                    const fileId = url.match(/id=([^&]+)/)[1]

                    await drive.files.delete({
                        fileId: fileId
                    })
                } catch (err) {


                    files.forEach(file => {
                        fs.unlinkSync(file.path)
                    })

                    console.error(err)
                }
            }))

            files.forEach(file => {
                fs.unlinkSync(file.path)
            })

            await rating.destroy()

            return res.status(200).json({ message: "Рейтинг успешно удален" })
        } catch (err) {
            console.error(err)

            files.forEach(file => {
                fs.unlinkSync(file.path)
            })

            return res.status(500).json({ message: "Ошибка сервера" })
        }

    }
}

export default new RatingController()