import mongoose, { Schema, Document, ObjectId, Types } from "mongoose"
import User from "./user"
export interface ICourse extends Document {
  title: string
  description: string
  instructor: Types.ObjectId
  price: number
}

const courseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    price: { type: Number, default: 0 }
  },
  { timestamps: true }
)

export default mongoose.model<ICourse>("Course", courseSchema)
