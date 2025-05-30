import { Router } from "express"
import catalogController from "../controllers/catalogController.js"
import multer from 'multer'
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = Router()

const upload = multer({ dest: 'uploads/' })

router.post("/", authMiddleware, upload.array("img", 1), catalogController.create)
router.get("/", catalogController.getAllCatalog)
router.get("/:catalogId", catalogController.getAllCatalogProducts)
router.put("/:id", authMiddleware, upload.array("img", 1), catalogController.updateCatalog)
router.delete("/:id", authMiddleware, upload.array("img", 1), catalogController.deleteCatalog)

export default router 