"use client";

import { useState, useEffect } from "react";
import axios from "@/src/lib/axios";

export default function AdminCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    instructor: "",
    price: 0,
  });

  // Fetch courses
  const fetchCourses = async () => {
    const res = await axios.get("/api/course");
    setCourses(res.data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle input
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create course
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await axios.post("/api/course");
    alert("Course created ✅");

    setForm({ title: "", description: "", instructor: "", price: 0 });
    fetchCourses();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Create Course</h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="block w-full text-black mb-3 p-2 border"
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="block w-full text-black mb-3 p-2 border"
        />

        <input
          name="instructor"
          placeholder="Instructor"
          value={form.instructor}
          onChange={handleChange}
          className="block w-full text-black mb-3 p-2 border"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="block w-full text-black mb-3 p-2 border"
        />

        <button className="bg-black text-white px-4 py-2 rounded">
          Create
        </button>
      </form>

      {/* COURSE LIST */}
      <h2 className="text-lg font-bold mb-3">All Courses</h2>

      {courses.map((c) => (
        <div key={c._id} className="bg-white p-3 mb-3 rounded shadow">
          <h3>{c.title}</h3>
          <p>{c.description}</p>
        </div>
      ))}
    </div>
  );
}