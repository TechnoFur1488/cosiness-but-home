import { ForeverProduct, Product } from "../model/model.js"

class ForeverController {
    async addForever(req, res) {
        try {
            const { productId } = req.params
            const forever = req.forever

            const product = await Product.findByPk(productId)

            if (!product) {
                return res.status(404).json({ message: "Такого товара не существует" })
            }

            const foreverItem = await ForeverProduct.findOne({ where: { foreverId: forever.id, productId } })

            // if (foreverItem) {
            //     return res.status(400).json({ message: "Товар уже добавлен в избранное" })
            // }

            await ForeverProduct.create({ foreverId: forever.id, productId })

            const foreverProducts = await ForeverProduct.findAll({ where: { foreverId: forever.id }, include: [Product], order: [["createdAt", "DESC"]] })

            return res.status(200).json({foreverProducts, message: "Товар успешно добавлен в избранное" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async getForever(req, res) {
        try {
            const { forever } = req

            const foreverItem = await ForeverProduct.findAll({ where: { foreverId: forever.id }, include: [Product], order: [["createdAt", "DESC"]] })

            return res.status(200).json({ foreverItem })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async deleteForever(req, res) {
        try {
            const { productId } = req.params
            const { forever } = req

            if (!productId) {
                return res.status(404).json({ message: "Такого товара не существует" })
            }

            await ForeverProduct.destroy({ where: { foreverId: forever.id, productId } })

            const foreverProducts = await ForeverProduct.findAll({ where: { foreverId: forever.id }, include: [Product], order: [["createdAt", "DESC"]] })

            return res.status(200).json({ foreverProducts, message: "Товар успешно удален из избранного" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }
}

export default new ForeverController()
