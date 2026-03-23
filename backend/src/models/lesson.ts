import mongoose, { Schema, Document } from "mongoose"

export interface ILesson extends Document {
  course: mongoose.Schema.Types.ObjectId
  title: string
  videoUrl: string
}

const lessonSchema = new Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    title: { type: String, required: true },
    videoUrl: { type: String, required: true }
  },
  { timestamps: true }
)

export default mongoose.model<ILesson>("Lessons", lessonSchema)
