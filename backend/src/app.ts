import express from "express";
import cors from "cors";
import courseRoutes from "./routes/courseRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/", (_req, res) => res.send("EduVerse backend running 🚀"));

export default app;