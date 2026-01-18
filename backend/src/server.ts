import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import userRoutes from "./routes/userRoutes" // ✅ ESModule import

dotenv.config()

const app = express()
app.use(express.json())

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string)
    console.log("MongoDB Connected ✅")

    // Routes
    app.use("/api/users", userRoutes)

    app.get("/", (_req, res) => res.send("EduVerse backend running 🚀"))

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  } catch (err) {
    console.error("MongoDB connection failed:", err)
    process.exit(1)
  }
}

startServer()
