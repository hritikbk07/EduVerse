import { Request, Response } from "express"
import User from "../models/User"
import jwt from "jsonwebtoken"

export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please provide all fields" })
  }

  const userExists = await User.findOne({ email })
  if (userExists) {
    return res.status(400).json({ message: "User already exists" })
  }

  const user = await User.create({
    name,
    email,
    password,
    role
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } else {
    res.status(400).json({ message: "Invalid user data" })
  }
}

// Generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "30d"
  })
}

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body

  // 1️⃣ Check email & password
  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" })
  }

  try {
    // 2️⃣ Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // 3️⃣ Compare password
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // 4️⃣ Send success response
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}
