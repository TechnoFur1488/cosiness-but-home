import { Router } from "express";
import userController from "../controllers/userController.js"
import rateLimit from "express-rate-limit"

const router = Router()

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Слишком много попыток входа, повторите попытку позже"
})

router.post("/login", limiter, userController.login)
router.post("/registration", userController.registration)

export default router