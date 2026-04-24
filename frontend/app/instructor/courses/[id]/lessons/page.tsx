"use client";

import { useState, use, useEffect } from "react";
import { uploadVideoFile, createLesson, getLessonsByCourse } from "@/src/lib/axios";
import VideoPlayer from "@/src/components/VideoPlayer";

const AddLessonPage = ({ params }: { params: any }) => {
  const unwrappedParams = use(params) as any;
  const courseId = unwrappedParams.id;
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [lessons, setLessons] = useState<any[]>([]);

  const fetchLessons = async () => {
    try {
      const res = await getLessonsByCourse(courseId);
      setLessons(res.data);
    } catch (err: any) {
      console.error("Failed to fetch lessons:", err.response?.data || err);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!video) return alert("Upload a video");
    if (!title) return alert("Title is required");

    try {
      setLoading(true);
      setProgressMsg("Uploading video to Cloudinary... This may take a while.");

      const formData = new FormData();
      formData.append("video", video);

      // 1. Upload video
      const uploadRes = await uploadVideoFile(formData);
      const { videoUrl, publicId } = uploadRes.data;

      setProgressMsg("Video uploaded! Creating lesson record...");

      // 2. Create lesson
      await createLesson({
        title,
        courseId,
        videoUrl,
        publicId,
      });

      alert("Lesson successfully added!");
      setTitle("");
      setVideo(null);
      fetchLessons(); // Refresh list after upload
    } catch (error: any) {
      console.error("Error creating lesson:", error.response?.data || error.message || error);
      alert(`Error uploading lesson: ${error.response?.data?.message || error.message || "Unknown Error"}`);
    } finally {
      setLoading(false);
      setProgressMsg("");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 flex flex-col md:flex-row gap-8">
      
      {/* Upload Form (Left Column) */}
      <div className="flex-1">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-xl">
          <h1 className="text-2xl font-bold mb-6 text-white">Add New Lesson</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Lesson Title</label>
              <input
                type="text"
                placeholder="e.g. Introduction to Next.js"
                className="w-full p-4 bg-black/40 border border-slate-700/50 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Video File</label>
              <input
                type="file"
                accept="video/*"
                className="w-full text-slate-300 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20"
                onChange={(e) => setVideo(e.target.files?.[0] || null)}
              />
            </div>

            <button
              className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold px-4 py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Processing..." : "Upload Lesson Video"}
            </button>
            {progressMsg && <p className="text-sm text-indigo-400 font-semibold mt-4 text-center">{progressMsg}</p>}
          </form>
        </div>
      </div>

      {/* Existing Lessons (Right Column) */}
      <div className="flex-1 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-white">Course Lessons ({lessons.length})</h2>
        {lessons.length === 0 ? (
          <div className="text-slate-400 italic">No lessons have been uploaded yet.</div>
        ) : (
          <div className="grid gap-6 auto-rows-max h-full overflow-y-auto max-h-[800px] pr-2">
            {lessons.map((lesson) => (
              <div key={lesson._id} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col">
                <h3 className="font-bold text-lg text-white mb-3">{lesson.title}</h3>
                <VideoPlayer videoUrl={lesson.videoUrl} />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AddLessonPage;