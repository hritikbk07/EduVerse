"use client";

import { useEffect, useState } from "react";
import API from "@/src/lib/axios";

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
}

export default function InstructorDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        // Retrieve token from localStorage
        const token = JSON.parse(localStorage.getItem("user") || "{}")?.token;

        if (!token) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }

        // Make API request to your backend
        const res = await API.get("/api/courses/instructor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCourses(res.data);
      } catch (err: any) {
        console.error("Error fetching courses:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <div className="p-8">Loading courses...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Courses</h1>

      {courses.length === 0 && <p>No courses found. Create one!</p>}

      {courses.map((c) => (
        <div key={c._id} className="border p-4 mb-3 rounded-lg bg-gray-800 text-white">
          <h2 className="font-semibold text-lg">{c.title}</h2>
          <p className="mt-1">{c.description}</p>
          <p className="mt-2 font-medium">Price: ${c.price}</p>
        </div>
      ))}
    </div>
  );
}