import { Router } from "express"
import ratingController from "../controllers/ratingController.js"
import multer from "multer"
import { authMiddleware } from "../middleware/authMiddleware.js"

const router = Router()

const upload = multer({ dest: "uploads/" })

router.post("/:productId", upload.array("img", 10), ratingController.createRating)
router.get("/:productId", ratingController.getAllRating)
router.get("/:productId/my-rating", ratingController.getOneMyRating)
router.get("/:productId/lazy-rating", ratingController.getAllRatingLazy)
router.get("/one-rating/:id", ratingController.getOneRating)
router.put("/:id", authMiddleware, upload.array("img", 10), ratingController.updateRating)
router.delete("/:id", authMiddleware, upload.array("img", 10), ratingController.deleteRating)

export default router   