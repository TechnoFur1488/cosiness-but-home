import { Cart } from "../model/model.js"
import { randomBytes } from "crypto"
import { generateToken } from "../utils/cookieSetings.js"

export const cartMiddleware = async (req, res, next) => {
    try {

        let cart

        let sessionId = req.cookies.sessionId

        if (!sessionId) {
            sessionId = randomBytes(16).toString("hex")
            generateToken(res, sessionId, 30)
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