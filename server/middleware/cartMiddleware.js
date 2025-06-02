import { randomBytes } from "crypto"
import { generateToken } from "../utils/cookieSetings.js"

export const cartMiddleware = async (req, res, next) => {
    try {
        let sessionId = req.cookies.sessionId

        if (!sessionId) {
            sessionId = randomBytes(16).toString("hex")
            generateToken(res, sessionId, 30)
        }

        req.sessionId = sessionId

        next()
    } catch (err) {
        console.error(err)
        next()
    }
}