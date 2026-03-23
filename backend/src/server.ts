import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import courseRoutes from "./routes/courseRoutes"
import userRoutes from "./routes/userRoutes"
import uploadRoutes from "./routes/uploadRoutes"


dotenv.config()

const app = express()
app.use(express.json())

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string)
    console.log("MongoDB Connected ✅")

    app.use("/api/users", userRoutes)
    app.use("/api/courses", courseRoutes)
    app.use("/api/upload", uploadRoutes)


    app.get("/", (_req, res) => res.send("EduVerse backend running 🚀"))

    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  } catch (err) {
    console.error("MongoDB connection failed:", err)
    process.exit(1)
  }
}

startServer()

