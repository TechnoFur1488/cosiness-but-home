import { Router } from "express"
import foreverController from "../controllers/foreverController.js"

const router = Router()

router.post("/:productId", foreverController.addForever)
router.get("/", foreverController.getForever)
router.delete("/:productId", foreverController.deleteForever)

export default router