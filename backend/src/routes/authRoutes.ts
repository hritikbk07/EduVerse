import express from "express"
import { registerUser, loginUser, getProfile, logoutUser } from "../controllers/authController"
import { protect } from "../middleware/authMiddleware"

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.get("/profile", protect, getProfile)

export default router
