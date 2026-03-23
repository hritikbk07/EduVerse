import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import user, { IUser } from "../models/user"

// Custom TypeScript type for Request with user
interface AuthRequest extends Request {
  user?: IUser
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1]

      // Verify token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string)

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select("-password")

      next() // allow access
    } catch (error) {
      console.error(error)
      res.status(401).json({ message: "Not authorized, token failed" })
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" })
  }
}
export const admin = (req: any, res: any, next: any) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(403).json({ message: "Admin only" })
  }
}
