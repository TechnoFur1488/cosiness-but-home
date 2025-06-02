import { ForeverProduct, Product, Forever } from "../model/model.js"

class ForeverController {
    async addForever(req, res) {
        const { productId } = req.params
        const sessionId = req.sessionId

        try {

            const product = await Product.findByPk(productId)

            if (!product) {
                return res.status(404).json({ message: "Такого товара не существует" })
            }

            let forever = await Forever.findOne({ where: { sessionId } })

            if (!forever) {
                forever = await Forever.create({ sessionId });
            }

            const foreverItem = await ForeverProduct.findOne({ where: { foreverId: sessionId, productId } })

            if (foreverItem) {
                return res.status(400).json({ message: "Товар уже добавлен в избранное" })
            }

            await ForeverProduct.create({ foreverId: sessionId, productId })

            const foreverProducts = await ForeverProduct.findAll({ where: { foreverId: sessionId }, include: [Product], order: [["createdAt", "DESC"]] })

            return res.status(200).json({ foreverProducts, message: "Товар успешно добавлен в избранное" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async getForever(req, res) {
        try {
            const sessionId = req.sessionId

            const foreverItem = await ForeverProduct.findAll({ where: { foreverId: sessionId }, include: [Product], order: [["createdAt", "DESC"]] })

            return res.status(200).json({ foreverItem })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async deleteForever(req, res) {
        const { productId } = req.params
        const sessionId = req.sessionId
        
        try {

            if (!productId) {
                return res.status(404).json({ message: "Такого товара не существует" })
            }

            await ForeverProduct.destroy({ where: { foreverId: sessionId, productId } })

            const foreverProducts = await ForeverProduct.findAll({ where: { foreverId: sessionId }, include: [Product], order: [["createdAt", "DESC"]] })

            return res.status(200).json({ foreverProducts, message: "Товар успешно удален из избранного" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }
}

export default new ForeverController()
