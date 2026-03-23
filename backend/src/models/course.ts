import mongoose, { Schema, Document } from "mongoose"

export interface ICourse extends Document {
  title: string
  description: string
  instructor: string
  price: number
}

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    price: { type: Number, default: 0 }
  },
  { timestamps: true }
)

export default mongoose.model<ICourse>("Courses", courseSchema)
