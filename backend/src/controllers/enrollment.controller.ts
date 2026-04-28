import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Enrollment from '../models/Enrollment';
import Course from '../models/course';
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
