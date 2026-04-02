import express from "express";
import {
  addLesson,
  createCourse,
  getCourses,
  getLessons,
  getSingleCourse,
  getInstructorCourses, // ✅ ADD
} from "../controllers/courseController";

import { protect } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router = express.Router();

// ✅ Public
router.get("/", getCourses);

// ✅ Instructor route (MUST BE BEFORE :courseId)
router.get(
  "/instructor",
  protect,
  requireRole("instructor", "admin"),
  getInstructorCourses
);

// ✅ Lessons
router.get("/:courseId/lessons", getLessons);

// ✅ Create course (FIXED)
router.post(
  "/create",
  protect,
  requireRole("instructor", "admin"), // ✅ FIXED
  createCourse
);

// ✅ Single course
router.get("/:courseId", getSingleCourse);

// ✅ Add lesson
router.post(
  "/lesson",
  protect,
  requireRole("instructor", "admin"),
  addLesson
);

export default router;
