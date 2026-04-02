import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILesson extends Document {
  course: Types.ObjectId; // ✅ FIXED
  title: string;
  videoUrl: string;
}

const lessonSchema = new Schema<ILesson>(
  {
    course: {
      type: Schema.Types.ObjectId, // ✅ correct for schema
      ref: "Courses", // ⚠️ match your Course model name
      required: true,
    },
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ILesson>("Lessons", lessonSchema);