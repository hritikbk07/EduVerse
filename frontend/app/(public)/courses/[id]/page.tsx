"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import API from "@/src/lib/axios";
import Navbar from "@/src/components/navbar/Navbar";

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  // add lessons later: lessons?: Lesson[];
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await API.get(`/courses/${courseId}`);
        setCourse(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to fetch course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) return <p className="p-8">Loading course...</p>;
  if (error) return <p className="p-8 text-red-500">{error}</p>;
  if (!course) return <p className="p-8">Course not found</p>;

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Course Header */}
      <section className="p-8 bg-gray-100 text-center">
        <h1 className="text-3xl font-bold">{course.title}</h1>
        <p className="text-gray-600 mt-2">{course.description}</p>
        <p className="font-bold mt-4">Rs {course.price}</p>
      </section>

      {/* CTA / Enroll Button */}
      <section className="text-center p-8">
        <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
          Enroll Now
        </button>
      </section>

      {/* Placeholder for Lessons */}
      <section className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Lessons (Coming Soon)</h2>
        <p className="text-gray-500">The lesson list will appear here once implemented.</p>
      </section>
    </div>
  );
}