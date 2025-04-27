import Router from "express"
import cartController from "../controllers/cartController.js"

const router = Router()

router.post("/", cartController.addCart)
router.get("/", cartController.getCart)
router.delete("/:id", cartController.deleteCart)

export default router