import { Router } from "express"
import productController from "../controllers/productController.js"
import multer from 'multer'

const router = Router()

const upload = multer({ dest: 'uploads/' });

router.post("/", upload.array("img", 10), productController.createProduct)
router.get("/", productController.getAllProducts)
router.get("/:id", productController.getOneProducts)
router.put("/:id", upload.array("img", 10), productController.updateProduct)
router.delete("/:id", upload.array("img", 10), productController.deleteProduct)

export default router