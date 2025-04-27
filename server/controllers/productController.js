import { Product } from "../model/model.js"
import path, { dirname, join } from "path"
import { google } from "googleapis"
import fs from "fs"
import { fileURLToPath } from "url"
import dotenv from "dotenv"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const auth = new google.auth.GoogleAuth({
    keyFile: join(__dirname, "..", "google-credentials.json"),
    scopes: ["https://www.googleapis.com/auth/drive"]
})

const drive = google.drive({ version: "v3", auth, timeout: 10000 })

class ProductController {
    async createProduct(req, res) {
        try {
            const { name, price, discount, compound, warp, hight, hardness, size, description, from, catalogId } = req.body
            const files = req.files

            if (!name || !from || !price || !compound || !warp || !hight || !hardness || !size || !description || !catalogId) {

                files.forEach(file => {
                    fs.unlinkSync(file.path)
                })

                return res.status(400).json({ message: "Не все поля заполнены" })

            }

            if (description.trim().length < 100) {

                files.forEach(file => {
                    fs.unlinkSync(file.path)
                })

                return res.status(406).json({ message: "Описание не может быть меньше чем 100 симолов" })

            }

            if (!files) {

                return res.status(406).json({ message: "Не все поля заполнены" })

            }

            const imageUrls = await Promise.all(files.map(async (file) => {
                const response = await drive.files.create({
                    requestBody: {
                        name: file.originalname || path.basename(file.path),
                        mimeType: file.mimetype,
                        parents: [process.env.GOOGLE_DRIVE_PRODUCT_PHOTO]
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

            const sizeArray = typeof size === "string" ? size.split(" ") : Array.isArray(size) ? size : []

            const sizes = sizeArray.map(size => {
                const [w, l] = size.split("x").map(Number)
                const squareMeters = w * l
                const total = Math.round(price * squareMeters)

                return { size, total, squareMeters }
            })

            const product = await Product.create({ img: imageUrls, name, price, discount, compound, warp, hight, hardness, size: sizes.map(s => s.size), description, from, catalogId })

            files.forEach(file => {
                fs.unlinkSync(file.path)
            })

            return res.status(201).json({ product, message: "Товар успешно создан" })
        } catch (err) {
            console.error(err)

            files.forEach(file => {
                fs.unlinkSync(file.path)
            })

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
        try {
            const { id } = req.params

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
        try {
            const { id } = req.params
            const files = req.files

            if (!id) {

                files.forEach(file => {
                    fs.unlinkSync(file.path)
                })

                return res.status(404).json({ message: "Такого товара не существует" })
            }

            const product = await Product.findByPk(id)

            if (!product) {

                files.forEach(file => {
                    fs.unlinkSync(file.path)
                })

                return res.status(404).json({ message: "Такого товара не существует" })
            }

            const imgUrls = product.img

            await Promise.all(imgUrls.map(async (url) => {
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
                }
            }))

            files.forEach(file => {
                fs.unlinkSync(file.path)
            })

            await product.destroy()

            return res.status(200).json({ message: "Товар успешно удален" })
        } catch (err) {
            console.error(err)

            files.forEach(file => {
                fs.unlinkSync(file.path)
            })

            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async updateProduct(req, res) {
        try {
            const { id } = req.params
            const { name, price, discount, compound, warp, hight, hardness, size, description, from, catalogId } = req.body
            const files = req.files

            if (!id) {

                files.forEach(file => {
                    fs.unlinkSync(file.path)
                })

                return res.status(404).json({ message: "Такого товара не существует" })
            }

            let product = await Product.findByPk(id)

            if (!files || files.length === 0) {

                files.forEach(file => {
                    fs.unlinkSync(file.path)
                })

                return res.status(400).json({ message: "Не все поля заполнены" })
            }

            if (!name || !from || !price || !compound || !warp || !hight || !hardness || !size || !description || !catalogId) {

                files.forEach(file => {
                    fs.unlinkSync(file.path)
                })

                return res.status(400).json({ message: "Не все поля заполнены" })
            }

            if (description.trim().length < 100) {
                files.forEach(file => {
                    fs.unlinkSync(file.path)
                })
                return res.status(406).json({ message: "Описание не может быть меньше чем 100 симолов" })
            }

            await Promise.all(product.img.map(async (url) => {
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
                }
            }))

            const imageUrls = await Promise.all(files.map(async (file) => {
                const response = drive.files.create({
                    requestBody: {
                        name: file.originalname || path.basename(file.path),
                        mimeType: file.mimetype,
                        parents: [process.env.GOOGLE_DRIVE_PRODUCT_PHOTO]
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

            const sizeArray = typeof size === "string" ? size.split(" ") : Array.isArray(size) ? size : []

            product = await Product.update({ img: imageUrls, name, price, discount, compound, warp, hight, hardness, size: sizeArray, description, from, catalogId }, { where: { id } })

            files.forEach(file => {
                fs.unlinkSync(file.path)
            })

            const productUpdate = await Product.findOne({ where: { id } })

            return res.status(200).json({ productUpdate, message: "Товар успешно обновлен" })


        } catch (err) {
            console.error(err)

            files.forEach(file => {
                fs.unlinkSync(file.path)
            })

            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }
}

export default new ProductController()