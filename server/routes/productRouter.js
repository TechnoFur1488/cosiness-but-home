import { Router } from "express"
import productController from "../controllers/productController.js"
import multer from 'multer'
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router()

const upload = multer({ dest: 'uploads/' });

router.post("/", authMiddleware, upload.array("img", 10), productController.createProduct)
router.get("/", productController.getAllProducts)
router.get("/:id", productController.getOneProducts)
router.put("/:id", authMiddleware, upload.array("img", 10), productController.updateProduct)
router.delete("/:id", authMiddleware, upload.array("img", 10), productController.deleteProduct)

export default router