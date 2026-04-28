import fs from "fs";
import cloudinary from "../config/cloudinary";

// Upload function
export const uploadVideo = async (filePath: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
    });

    // remove temp file
    // fs.unlinkSync(filePath);

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Video upload failed");
  }
};