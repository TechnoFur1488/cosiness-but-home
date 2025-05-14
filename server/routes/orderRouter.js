import { Router } from "express"
import orderController from "../controllers/orderController.js"

const router = Router()

router.post("/", orderController.createOrder)
router.post("/:productId", orderController.createOrderOne)
router.get("/", orderController.getAllOrder)

export default router