import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { User } from "../model/model.js"

const generateJwt = (id, email, role) => {
    return jwt.sign({ id, email, role }, process.env.SECRET_KEY, { expiresIn: "24h" })
}

class UserController {
    async registration(req, res) {
        try {
            const { email, password, name } = req.body

            if (!email || !password || !name) {
                return res.status(400).json({ message: "Не все поля заполнены" })
            }

            const candidat = await User.findOne({ where: { email } })

            if (candidat) {
                return res.status(400).json({ message: "Пользователь с таким email уже существует" })
            }

            const hashPassword = await bcrypt.hash(password, 10)
            const user = await User.create({ name, email, password: hashPassword, role: "USER" })
            const token = generateJwt(user.id, user.email, user.role)

            return res.json({ token })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ message: "Ошибка сервера" })
        }
    }

    async login(req, res) {
        try {
            const { name, email, password } = req.body
            const user = await User.findOne({ where: { email, name } })

            if (!user) {
                return res.status(400).json({ message: "Пользователь не найден" })
            }

            let comparePassword = bcrypt.compareSync(password, user.password)

            if (!comparePassword) {
                return res.status(400).json({ message: "Неверный пароль" })
            }

            const token = generateJwt(user.id, user.email, user.role)
            return res.json({ token, user: {id: user.id, name: user.name, email: user.email, role: user.role} })
        } catch (err) {
            console.error(err)
            return res.status(500).json({message: "Ошибка сервера"})
        }
    }
}

export default new UserController()