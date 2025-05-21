import { randomBytes } from "crypto";
import { generateToken } from "../utils/cookieSetings.js";

export const ratingMiddleware = async (req, res, next) => {
    try {
        let sessionId = req.cookies.sessionId;

        if (!sessionId) {
            sessionId = randomBytes(16).toString("hex");
            generateToken(res, sessionId, 365)
        }

        req.sessionId = sessionId;
        next();
    } catch (err) {
        console.error("Ошибка в ratingMiddleware:", err);
        return res.status(500).json({ message: "Ошибка сервера" });
    }
};