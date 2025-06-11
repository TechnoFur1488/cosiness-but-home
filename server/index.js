import express from "express"
import sequelize from "./db.js"
import "./model/model.js"
import router from "./routes/routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["POST", "GET", "PUT", "DELETE"]
}))

app.use("/api", router)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync({ alter: true })
        app.listen(PORT, () => {
            console.log(`Сервер работает на порту ${PORT}`)
            console.log(`Доступен в локальной сети по IP: http://ВАШ_ЛОКАЛЬНЫЙ_IP:${PORT}`)
        })
    } catch (e) {
        console.error(e)
    }
}

start()
