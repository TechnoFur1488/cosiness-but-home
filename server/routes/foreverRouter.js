import { Router } from "express"
import foreverController from "../controllers/foreverController.js"

const router = Router()

router.post("/", foreverController.addForever)
router.get("/", foreverController.getForever)
router.delete("/:id", foreverController.deleteForever)

export default router