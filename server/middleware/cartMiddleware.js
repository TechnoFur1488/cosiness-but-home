import { Cart } from "../model/model.js"
import { randomBytes } from "crypto"

export const cartMiddleware = async (req, res, next) => {
    try {

        let cart

        let sessionId = req.cookies.sessionId

        if (!sessionId) {
            sessionId = randomBytes(16).toString("hex")
            res.cookie("sessionId", sessionId, { maxAge: 30 * 24 * 60 * 60 * 1000 })
        }

        cart = await Cart.findOne({ where: { sessionId } })

        if(!cart) {
            cart = await Cart.create({ sessionId })
        }

        req.sessionId = sessionId
        req.cart = cart

        next()
    } catch (err) {
        console.error(err)
        next()
    }
}