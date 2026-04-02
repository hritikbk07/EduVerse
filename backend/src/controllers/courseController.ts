// src/controllers/courseController.ts
import { Request, Response } from "express";
import { Types } from "mongoose";
import Course from "../models/course";
import Lesson from "../models/lesson";
import { IUser } from "../models/user";

// ✅ Create Course (Admin only)
export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, price } = req.body;

    // Ensure instructor comes from logged-in user
    const instructor = (req.user as IUser)?._id;
    if (!instructor) {
      res.status(401).json({ message: "Unauthorized, instructor not found" });
      return;
    }

    // Validate input
    if (!title || !description) {
      res.status(400).json({ message: "Please provide title and description" });
      return;
    }

    const course = await Course.create({
      title,
      description,
      instructor,
      price: price || 0,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error("COURSE CREATE ERROR 👉", error);
    res.status(500).json({ message: "Error creating course" });
  }
};

// ✅ Add Lesson to Course (Admin only)
export const addLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId, title, videoUrl } = req.body;

    // Validation
    if (!courseId || !title || !videoUrl) {
      res.status(400).json({ message: "Please provide courseId, title, and videoUrl" });
      return;
    }

    // Check valid ObjectId
    if (!Types.ObjectId.isValid(courseId)) {
      res.status(400).json({ message: "Invalid course ID" });
      return;
    }

    // Check course exists
    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    const lesson = await Lesson.create({
      course: new Types.ObjectId(courseId),
      title,
      videoUrl,
    });

    res.status(201).json(lesson);
  } catch (error) {
    console.error("LESSON ERROR 👉", error);
    res.status(500).json({ message: "Error adding lesson" });
  }
};

// ✅ Get All Courses (Public)
export const getCourses = async (_req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Course.find().populate("instructor", "name email"); // optional populate instructor info
    res.status(200).json(courses);
  } catch (error) {
    console.error("GET COURSES ERROR 👉", error);
    res.status(500).json({ message: "Error fetching courses" });
  }
};

// ✅ Get Lessons of a Course (Public)
export const getLessons = async (req: Request, res: Response): Promise<void> => {
  try {
    // const { courseId } = req.params;
    const courseId = req.params.courseId as string;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(courseId)) {
      res.status(400).json({ message: "Invalid course ID" });
      return;
    }

    const lessons = await Lesson.find({ course: new Types.ObjectId(courseId) });

    res.status(200).json(lessons);
  } catch (error) {
    console.error("GET LESSONS ERROR 👉", error);
    res.status(500).json({ message: "Error fetching lessons" });
  }
};

export const getSingleCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course" });
  }
};

export const getInstructorCourses = async (req: Request, res: Response) => {
  try {
    const instructorId = (req.user as IUser)?._id;

    const courses = await Course.find({
      instructor: instructorId,
    });

    res.status(200).json(courses);
  } catch (error) {
    console.error("INSTRUCTOR COURSES ERROR 👉", error);
    res.status(500).json({ message: "Error fetching instructor courses" });
  }
};
// ✅ Update Course (Admin only)

export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.courseId;

    // ✅ Normalize to string
    const courseId = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!courseId || !Types.ObjectId.isValid(courseId)) {
      res.status(400).json({ message: "Invalid course ID" });
      return;
    }

    const updates = req.body;

    const course = await Course.findByIdAndUpdate(courseId, updates, {
      new: true,
    });

    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    res.status(200).json(course);
  } catch (error) {
    console.error("UPDATE COURSE ERROR 👉", error);
    res.status(500).json({ message: "Error updating course" });
  }
};

// ✅ Delete Course (Admin only)
export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    // const { courseId } = req.params;
    const rawId = req.params.courseId;
    // ✅ Normalize to string
    const courseId = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!Types.ObjectId.isValid(courseId)) {
      res.status(400).json({ message: "Invalid course ID" });
      return;
    }

    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
      res.status(404).json({ message: "Course not found" });
      return;
    }

    // Optional: delete all lessons of this course
    await Lesson.deleteMany({ course: new Types.ObjectId(courseId) });

    res.status(200).json({ message: "Course and lessons deleted successfully" });
  } catch (error) {
    console.error("DELETE COURSE ERROR 👉", error);
    res.status(500).json({ message: "Error deleting course" });
  }
};