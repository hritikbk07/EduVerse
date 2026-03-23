import { Request, Response } from "express"
import cloudinary from "../config/cloudinary"

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    // ✅ If file not uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" })
    }

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          folder: "eduverse_videos"
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )

      stream.end(req.file!.buffer) // ✅ now TS knows file exists
    })

    res.status(200).json({
      message: "Video uploaded successfully",
      videoUrl: result.secure_url
    })
  } catch (error) {
    console.log("UPLOAD ERROR 👉", error)
    res.status(500).json({ message: "Video upload failed" })
  }
}
