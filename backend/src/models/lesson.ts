import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILesson extends Document {
  title: string;
  videoUrl: string;
  publicId: string;
  course: Types.ObjectId;
  order: number;
}

const lessonSchema = new Schema<ILesson>(
  {
    title: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Courses",
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ILesson>("Lesson", lessonSchema);