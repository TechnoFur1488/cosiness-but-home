import { CartProduct, Product } from "../model/model.js"

class CartController {
    async addCart(req, res) {
        try {
            const { productId, quantity = 1, size } = req.body
            const cart = req.cart

            const product = await Product.findByPk(productId)
            
            if (!product) {
                return res.status(404).json({ message: "Такого товара не существует" })
            }
            
            const [w, l] = size.split("x").map(Number)
            const squareMeters = w * l
            const price = product.price * squareMeters
            const total = price * quantity


            let cartItem = await CartProduct.findOne({ where: { cartId: cart.id, productId, size, total } })

            if (cartItem) {
                const newQuantity = cartItem.quantity + quantity
                await cartItem.update({
                    quantity: newQuantity,
                    total: price * newQuantity
                })
            } else {
                await CartProduct.create({ cartId: cart.id, productId, quantity, size, total })
            }

            const cartProducts = await CartProduct.findAll({ where: { cartId: cart.id }, include: [Product], order: [["createdAt", "DESC"]] })

            return res.status(200).json({cartProducts, message: "Товар успешно добавлен в корзину" })

        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" }) 
        }
    }

    async getCart(req, res) {
        try {
            const { cart } = req

            const cartItem = await CartProduct.findAll({ where: { cartId: cart.id }, include: [Product], order: [["createdAt", "DESC"]] })

            return res.status(200).json({ cartItem })

        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async deleteCart(req, res) {
        try {
            const { id } = req.params
            const { cart } = req

            if (!id) {
                return res.status(404).json({ message: "Такого товара не существует" })
            }

            await CartProduct.destroy({ where: { cartId: cart.id, id } })

            const cartProducts = await CartProduct.findAll({ where: { cartId: cart.id }, include: [Product], order: [["createdAt", "DESC"]] })

            return res.status(200).json({cartProducts, message: "Товар успешно удален из корзины" })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }
}

export default new CartController()