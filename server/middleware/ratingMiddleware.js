import { randomBytes } from "crypto";

export const ratingMiddleware = async (req, res, next) => {
    try {
        let sessionId = req.cookies.sessionId;

        if (!sessionId) {
            sessionId = randomBytes(16).toString("hex");
            res.cookie("sessionId", sessionId, {
                maxAge: 365 * 24 * 60 * 60 * 1000,
                httpOnly: true
            });
        }

        req.sessionId = sessionId;
        next();
    } catch (err) {
        console.error("Ошибка в ratingMiddleware:", err);
        return res.status(500).json({ message: "Ошибка сервера" });
    }
};