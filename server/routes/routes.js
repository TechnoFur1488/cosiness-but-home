import { Router } from "express"
import productRouter from "./productRouter.js"
import catalogRouter from "./catalogRouter.js"
import ratingRouter from "./ratingRouter.js"
import orderRouter from "./orderRouter.js"
import cartRouter from "./cartRouter.js"
import foreverRouter from "./foreverRouter.js"
import userRouter from "./userRouter.js"
import { cartMiddleware } from "../middleware/cartMiddleware.js"
import { foreverMiddleware } from "../middleware/foreverMiddleware.js"
import { ratingMiddleware } from "../middleware/ratingMiddleware.js"

const router = Router()

router.use("/products", productRouter)
router.use("/catalog", catalogRouter)
router.use("/rating", ratingMiddleware, ratingRouter)
router.use("/order", cartMiddleware, orderRouter)
router.use("/cart", cartMiddleware, cartRouter)
router.use("/forever", foreverMiddleware, foreverRouter)
router.use("/user", userRouter)

export default router 