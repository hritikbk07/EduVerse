import express from "express";
import {
  createInstructor,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllCourses,
  deleteCourse,
  getStats,
  blockUser,
  toggleCoursePublish,
  getAllEnrollments,
  getAllPayments,
} from "../controllers/adminController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

// Apply protection to all routes below
router.use(protect);
router.use(admin);

// User management
router.get("/users", getAllUsers);
router.post("/create-instructor", createInstructor);
router.patch("/users/:id/role", updateUserRole);
router.patch("/users/:id/block", blockUser);
router.delete("/users/:id", deleteUser);

// Course management
router.get("/courses", getAllCourses);
router.patch("/courses/:id/publish", toggleCoursePublish);
router.delete("/courses/:id", deleteCourse);

// Stats management
router.get("/stats", getStats);

// Enrollment management
router.get("/enrollments", getAllEnrollments);

// Payment management
router.get("/payments", getAllPayments);

export default router;