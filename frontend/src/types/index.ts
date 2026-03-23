export interface IUser {
  _id: string
  name: string
  email: string
  role: "student" | "instructor" | "admin"
  token: string
}

export interface ICourse {
  _id: string
  title: string
  description: string
  instructor: string
  price: number
}

export interface ILesson {
  _id: string
  course: string
  title: string
  videoUrl: string
}