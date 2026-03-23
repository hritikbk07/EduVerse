import express from "express"
import { addLesson, createCourse, getCourses, getLessons } from "../controllers/courseController"
import { protect, admin } from "../middleware/authMiddleware"

const router = express.Router()

// Public
router.get("/", getCourses)
router.get("/:courseId/lessons", getLessons)

// Admin only
router.post("/", protect, admin, createCourse)
router.post("/lesson", protect, admin, addLesson)

export default router
