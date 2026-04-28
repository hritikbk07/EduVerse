import express from "express";
import {
  uploadLessonVideo,
  createLesson,
  getLessonsByCourse,
} from "../controllers/lesson.controller";
import { protect } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";
import { upload } from "../middleware/uploadMiddleware";

const router = express.Router();

// POST → Upload Video (Instructor only)
router.post(
  "/upload-video",
  protect,
  requireRole("instructor"),
  upload.single("video"),
  uploadLessonVideo
);

// POST → Create Lesson (Instructor only)
router.post(
  "/create",
  protect,
  requireRole("instructor"),
  createLesson
);

// GET → Get Lessons
router.get("/:courseId", protect, getLessonsByCourse);

export default router;
