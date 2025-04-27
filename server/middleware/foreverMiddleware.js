import { Forever } from "../model/model.js";
import { randomBytes } from "crypto";

export const foreverMiddleware = async (req, res, next) => {
    try {
        let forever

        let sessionId = req.cookies.sessionId

        if (!sessionId) {
            sessionId = randomBytes(16).toString("hex")
            res.cookie("sessionId", sessionId, { maxAge: 30 * 24 * 60 * 60 * 1000 })
        }

        forever = await Forever.findOne({ where: { sessionId } })

        if (!forever) {
            forever = await Forever.create({ sessionId })
        }

        req.sessionId = sessionId
        req.forever = forever

        next()
    } catch (err) {
        console.error(err)
        next()
    }
}