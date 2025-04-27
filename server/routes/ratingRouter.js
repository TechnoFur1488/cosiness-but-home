import { Router } from "express"
import ratingController from "../controllers/ratingController.js"
import multer from "multer"

const router = Router()

const upload = multer({ dest: "uploads/" })

router.post("/:productId", upload.array("img", 10), ratingController.createRating)
router.get("/:productId", ratingController.getAllRating)
router.put("/:id", upload.array("img", 10), ratingController.updateRating)
router.delete("/:id", upload.array("img", 10), ratingController.deleteRating)

export default router