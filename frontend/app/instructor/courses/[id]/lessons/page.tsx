"use client";

import { useState } from "react";
import API from "@/src/lib/axios";

const AddLessonPage = ({ params }: { params: { id: string } }) => {
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!video) return alert("Upload a video");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("video", video);

    try {
      setLoading(true);

      await API.post(`/api/lessons/${params.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Lesson added!");
      setTitle("");
      setVideo(null);
    } catch (error) {
      console.error(error);
      alert("Error uploading lesson");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Add Lesson</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Lesson Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setVideo(e.target.files?.[0] || null)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Add Lesson"}
        </button>
      </form>
    </div>
  );
};

export default AddLessonPage;