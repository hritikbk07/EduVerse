import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Enrollment from '../models/Enrollment';
import Course from '../models/course';
import Lesson from '../models/lesson';
import { asyncHandler } from '../utils/asyncHandler';
import { IUser } from '../models/user';

// @desc    Enroll in a course
// @route   POST /api/enrollments
// @access  Private
export const enrollCourse = asyncHandler(async (req: Request, res: Response) => {
  const rawCourseId = req.params.courseId;
  const courseId = Array.isArray(rawCourseId) ? rawCourseId[0] : rawCourseId;
  const userId = (req.user as IUser)?._id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, user not found' });
  }

  if (!courseId) {
    return res.status(400).json({ message: 'Please provide courseId' });
  }

  if (!Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }

  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  // Check for duplicate enrollment
  const existingEnrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
  });

  if (existingEnrollment) {
    return res.status(400).json({ message: 'Already enrolled in this course' });
  }

  // Create enrollment
  const enrollment = await Enrollment.create({
    user: userId,
    course: courseId,
  });

  res.status(201).json(enrollment);
});

// @desc    Get logged in user's courses
// @route   GET /api/enrollments/my-courses
// @access  Private
export const getMyCourses = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req.user as IUser)?._id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, user not found' });
  }

  // Get user's enrollments and populate the course details
  const enrollments = await Enrollment.find({ user: userId }).populate('course');

  res.status(200).json(enrollments);
});

// @desc    Get lessons for a course (only if enrolled)
// @route   GET /api/enrollments/:courseId/lessons
// @access  Private
export const getCourseLessons = asyncHandler(async (req: Request, res: Response) => {
  const courseId = req.params.courseId as string;
  const userId = (req.user as IUser)?._id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized, user not found' });
  }

  if (!Types.ObjectId.isValid(courseId)) {
    return res.status(400).json({ message: 'Invalid course ID' });
  }

  // Check enrollment
  const enrollment = await Enrollment.findOne({ user: userId, course: courseId });
  if (!enrollment) {
    return res.status(403).json({ message: 'You must enroll to access lessons.' });
  }

  // Fetch lessons for the course
  const lessons = await Lesson.find({ course: courseId });
  res.status(200).json(lessons);
});

