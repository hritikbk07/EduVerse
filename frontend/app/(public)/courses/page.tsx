"use client";

import { useState, useEffect } from "react";
import axios from "@/src/lib/axios";
import CourseCard from "@/src/components/course/CourseCard";
import { BookOpen } from "lucide-react";
import Link from "next/link";

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: {
    _id: string;
    name: string;
  };
  price: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/courses");
      setCourses(res.data);
      setError(null);
    } catch (err: any) {
      setError("Failed to fetch courses. Please check your database connection.");
      console.error("Fetch Error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-6 relative overflow-hidden pb-24 pt-20 flex flex-col items-center">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-7xl relative z-10">
        <Link href="/" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors mb-8 text-sm">
          ← Back to Homepage
        </Link>

        <section className="relative w-full z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">All <span className="text-indigo-400">Courses</span></h2>
            <p className="text-slate-400 max-w-xl mx-auto">Explore our complete catalog of premium masterclasses.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-center">
              <p className="text-rose-400 font-semibold">{error}</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="p-12 border border-slate-800/50 bg-slate-900/20 rounded-3xl text-center backdrop-blur-md">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 font-semibold text-lg">No courses available at the moment.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, i) => (
                <div key={course._id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both" style={{ animationDelay: `${(i % 6) * 100}ms` }}>
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}