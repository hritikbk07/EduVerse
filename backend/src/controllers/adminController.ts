import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import User, { IUser } from "../models/user";
import Course from "../models/course";
import Enrollment from "../models/Enrollment";
import { asyncHandler } from "../utils/asyncHandler";

type UserRole = "student" | "instructor" | "admin";
const VALID_ROLES: UserRole[] = ["student", "instructor", "admin"];

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private / Admin
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const adminUser = req.user as IUser;

  if (!adminUser || adminUser.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  const users = await User.find().select("-password");

  res.status(200).json({
    count: users.length,
    users,
  });
});

// @desc    Create a new instructor (admin only)
// @route   POST /api/admin/create-instructor
// @access  Private / Admin
export const createInstructor = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create instructor
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "instructor",
    });

    res.status(201).json({
      message: "Instructor created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
);

// @desc    Update user role (admin only)
// @route   PATCH /api/admin/users/:id/role
// @access  Private / Admin
export const updateUserRole = asyncHandler(
  async (req: Request, res: Response) => {
    const adminUser = req.user as IUser;

    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const id = req.params.id as string;
    const { role } = req.body;

    // Validate role value
    if (!role || !VALID_ROLES.includes(role as UserRole)) {
      return res.status(400).json({
        message: `Invalid role. Must be one of: ${VALID_ROLES.join(", ")}`,
      });
    }

    // Validate the target user ID format
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Prevent admin from changing their own role
    if (adminUser._id?.toString() === id) {
      return res
        .status(400)
        .json({ message: "Admins cannot change their own role" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role as UserRole;
    await user.save();

    res.status(200).json({
      message: `User role updated to '${role}' successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
);

// @desc    Delete user by ID (admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private / Admin
export const deleteUser = asyncHandler(
  async (req: Request, res: Response) => {
    const adminUser = req.user as IUser;

    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const id = req.params.id as string;

    // Validate the target user ID format
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Prevent admin from deleting themselves
    if (adminUser._id?.toString() === id) {
      return res
        .status(400)
        .json({ message: "Admins cannot delete their own account" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.status(200).json({
      message: "User deleted successfully",
      deletedUser: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
);

// @desc    Get all courses (admin only)
// @route   GET /api/admin/courses
// @access  Private / Admin
export const getAllCourses = asyncHandler(
  async (req: Request, res: Response) => {
    const adminUser = req.user as IUser;

    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Fetch all courses first
    const coursesRaw = await Course.find().lean();

    // Manually populate to avoid CastError on malformed instructor IDs
    const courses = await Promise.all(
      coursesRaw.map(async (course) => {
        try {
          if (course.instructor && Types.ObjectId.isValid(course.instructor.toString())) {
            const instructor = await User.findById(course.instructor)
              .select("name email")
              .lean();
            return { ...course, instructor };
          }
          return { ...course, instructor: null };
        } catch (error) {
          console.error("Error populating instructor for course:", course._id, error);
          return { ...course, instructor: null };
        }
      })
    );

    res.status(200).json({
      count: courses.length,
      courses,
    });
  }
);

// @desc    Delete a course by ID (admin only)
// @route   DELETE /api/admin/courses/:id
// @access  Private / Admin
export const deleteCourse = asyncHandler(
  async (req: Request, res: Response) => {
    const adminUser = req.user as IUser;

    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const id = req.params.id as string;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.deleteOne();

    res.status(200).json({
      message: "Course deleted successfully",
      deletedCourse: {
        _id: course._id,
        title: course.title,
        instructor: course.instructor,
      },
    });
  }
);

// @desc    Get admin statistics
// @route   GET /api/admin/stats
// @access  Private / Admin
export const getStats = asyncHandler(
  async (req: Request, res: Response) => {
    const adminUser = req.user as IUser;

    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Basic Counts
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    // Total Revenue Calculation
    // Populate course in enrollments to sum course price
    const enrollments = await Enrollment.find().populate<{course: any}>("course");
    const totalRevenue = enrollments.reduce((sum, enrollment) => {
      return sum + (enrollment.course?.price || 0);
    }, 0);

    // Advanced Bonus: Recent users (last 5)
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select("-password -__v");

    // Advanced Bonus: Recent courses (last 5)
    const recentCoursesRaw = await Course.find().sort({ createdAt: -1 }).limit(5).lean();
    const recentCourses = await Promise.all(
      recentCoursesRaw.map(async (course) => {
        try {
          if (course.instructor && Types.ObjectId.isValid(course.instructor.toString())) {
            const instructor = await User.findById(course.instructor)
              .select("name email")
              .lean();
            return { ...course, instructor };
          }
          return { ...course, instructor: null };
        } catch (error) {
          return { ...course, instructor: null };
        }
      })
    );

    // Advanced Bonus Mock Chart Data: grouping users / revenue over time
    const chartData = [
      { name: "Jan", users: 10, revenue: 500 },
      { name: "Feb", users: 15, revenue: 900 },
      { name: "Mar", users: 20, revenue: 1500 },
      { name: "Apr", users: 40, revenue: 2000 },
    ];

    res.status(200).json({
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalRevenue,
      recentUsers,
      recentCourses,
      chartData
    });
  }
);