"use client";

import { useState } from "react";
import axios from "@/src/lib/axios";

export default function AddLesson() {
  const [form, setForm] = useState({
    courseId: "",
    title: "",
    videoUrl: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await axios.post("/course/lesson", form);
    alert("Lesson added 🎥");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <input placeholder="Course ID" onChange={(e)=>setForm({...form, courseId:e.target.value})} />
      <input placeholder="Lesson Title" onChange={(e)=>setForm({...form, title:e.target.value})} />
      <input placeholder="Video URL" onChange={(e)=>setForm({...form, videoUrl:e.target.value})} />

      <button>Add Lesson</button>
    </form>
  );
}