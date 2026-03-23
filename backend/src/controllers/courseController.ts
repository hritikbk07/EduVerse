import { Request, Response } from "express"
import Course from "../models/course"
import Lesson from "../models/lesson"

// ✅ Admin: Create Course
export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, instructor, price } = req.body

    // validation
    if (!title || !description || !instructor) {
      res.status(400).json({ message: "Please provide title, description and instructor" })
      return
    }

    const course = await Course.create({
      title,
      description,
      instructor,
      price
    })

    res.status(201).json(course)
  } catch (error) {
    console.log("COURSE CREATE ERROR 👉", error)
    res.status(500).json({ message: "Error creating course" })
  }
}

// ✅ Admin: Add Lesson (Video URL)
export const addLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const { courseId, title, videoUrl } = req.body

    // validation
    if (!courseId || !title || !videoUrl) {
      res.status(400).json({ message: "Please provide courseId, title and videoUrl" })
      return
    }

    // check course exists
    const courseExists = await Course.findById(courseId)

    if (!courseExists) {
      res.status(404).json({ message: "Course not found" })
      return
    }

    const lesson = await Lesson.create({
      course: courseId,
      title,
      videoUrl
    })

    res.status(201).json(lesson)
  } catch (error) {
    console.log("LESSON ERROR 👉", error)
    res.status(500).json({ message: "Error adding lesson" })
  }
}

// ✅ Get All Courses (Public)
export const getCourses = async (_req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Course.find()
    res.status(200).json(courses)
  } catch (error) {
    console.log("GET COURSES ERROR 👉", error)
    res.status(500).json({ message: "Error fetching courses" })
  }
}

// ✅ Get Lessons of a Course (Public)
export const getLessons = async (req: Request, res: Response): Promise<void> => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId })
    res.status(200).json(lessons)
  } catch (error) {
    console.log("GET LESSONS ERROR 👉", error)
    res.status(500).json({ message: "Error fetching lessons" })
  }
}
