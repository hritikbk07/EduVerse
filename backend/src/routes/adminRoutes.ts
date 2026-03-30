import express from "express";
import { createInstructor } from "../controllers/adminController";
import { protect, admin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/create-instructor", protect, admin, createInstructor);

export default router;