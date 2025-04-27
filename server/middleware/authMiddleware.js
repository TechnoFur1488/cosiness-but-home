import jwt from "jsonwebtoken"

export const authMiddleware = (req, res, next) => {
    if (req === "OPTIONS") {
        next()
    }

    try {
        const token = req.headers.authorization.split(" ")[1]

        if (!token) {
            return res.status(401).json({ message: "Пользователь не авторизован" })
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()
    } catch (err) {
        console.error(err)
        return res.status(401).json({ message: "Пользователь не авторизован" })
    }
}