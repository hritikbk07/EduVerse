"use client";

import { useState } from "react";
import API from "@/src/lib/axios";

export default function CreateCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;

      const res = await API.post(
        "/api/courses/create",
        { title, description, price: Number(price) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Course created:", res.data);
      alert("Course created successfully!");
    } catch (err: any) {
      console.error("Error creating course:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error creating course");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create Course</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          Create Course
        </button>
      </form>
    </div>
  );
}