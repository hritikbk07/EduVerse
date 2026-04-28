import { Request, Response } from "express";
import fs from "fs";
import mongoose from "mongoose";
import Lesson from "../models/lesson";
import course from "../models/course";
import { uploadVideo } from "../services/video.service";

// Extend request type
interface AuthRequest extends Request {
  user?: any;
}

// ➤ Upload Video to Cloudinary
export const uploadLessonVideo = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Video file is required" });
    }

    const filePath = req.file.path;

    // Upload to Cloudinary
    const { secure_url, public_id } = await uploadVideo(filePath);

    // remove temp file
    fs.unlinkSync(filePath);

    return res.status(200).json({
      videoUrl: secure_url,
      publicId: public_id,
    });
  } catch (error) {
    // ✅ delete even if error happens
    if (req.file?.path) {
      fs.unlink(req.file.path, () => { });
    }
    console.error("UPLOAD VIDEO ERROR 👉", error);
    return res.status(500).json({
      message: "Error uploading video",
      error: error instanceof Error ? error.message : error
    });
  }
};

// ➤ Create Lesson in MongoDB
export const createLesson = async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { title, courseId, videoUrl, publicId, order } = req.body;

    if (!title || !courseId || !videoUrl || !publicId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid Course ID format" });
    }

    // Save lesson
    const lesson = await Lesson.create({
      title,
      videoUrl,
      publicId,
      course: courseId,
      order: order || 0,
    });

    return res.status(201).json({
      message: "Lesson created successfully",
      lesson,
    });
  } catch (error) {
    console.error("CREATE LESSON ERROR 👉", error);
    return res.status(500).json({ message: "Error creating lesson", error: error instanceof Error ? error.message : error });
  }
};

// ➤ Get Lessons by Course
export const getLessonsByCourse = async (req: Request, res: Response): Promise<any> => {
  try {
    const courseId = req.params.courseId as string;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid Course ID parameter" });
    }

    const lessons = await Lesson.find({ course: courseId }).sort({ order: 1 });

    return res.json(lessons);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching lessons" });
  }
};
