import { Router } from "express"
import catalogController from "../controllers/catalogController.js"

const router = Router()

router.post("/", catalogController.create)
router.get("/", catalogController.getAllCatalog)
router.get("/:catalogId", catalogController.getAllCatalogProducts)
router.put("/:id", catalogController.updateCatalog)
router.delete("/:id", catalogController.deleteCatalog)

export default router 