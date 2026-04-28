import express from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllCourses,
  deleteCourse,
} from "../controllers/adminController";
import { protect } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router = express.Router();

// Apply authentication and admin role requirement to all routes
router.use(protect);
router.use(requireRole("admin"));

// User management routes
router.get("/users", getAllUsers);
router.patch("/users/:id", updateUserRole);
router.delete("/users/:id", deleteUser);

// Course management routes
router.get("/courses", getAllCourses);
router.delete("/courses/:id", deleteCourse);

export default router;
