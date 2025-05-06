import { Router } from "express";
import userController from "../controllers/userController.js"

const router = Router()

router.post("/login", userController.login)
router.post("/registration", userController.registration)

export default router