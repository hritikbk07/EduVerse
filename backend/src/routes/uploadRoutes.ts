import express from "express"
import { uploadVideo } from "../controllers/uploadController"
import upload from "../middleware/uploadMiddleware"
import { protect, admin } from "../middleware/authMiddleware"

const router = express.Router()

// POST /api/upload/video
router.post("/video", protect, admin, upload.single("video"), uploadVideo)




export default router
