"use client";

import Navbar from "@/src/components/navbar/Navbar";
import CourseCard from "@/src/components/course/CourseCard";
import axios from "@/src/lib/axios";
import { useState, useEffect } from "react";
import { Sparkles, ArrowRight, Activity, BookOpen, Users } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("/api/courses");
      if (!res.data) {
        throw new Error("No data received from server");
      }
      setCourses(res.data);
    } catch (err: any) {
      console.error("The actual error object:", err);
      setError(err.message || "Error fetching courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24 selection:bg-indigo-500/30">
      <Navbar />

      {/* Decorative Blobs */}
      <div className="absolute top-0 left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 text-center max-w-5xl mx-auto flex flex-col items-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-semibold text-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <Sparkles className="w-4 h-4" />
          <span>The next generation of learning</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 shadow-sm">
          Learn Without <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">Limits.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          Upgrade your skills with world-class instructors. Dive into interactive, high-quality courses designed to accelerate your career.
        </p>

        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
          <Link href="/courses" className="group relative inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.7)] hover:scale-105 active:scale-95">
            Explore Courses
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-white font-bold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-md">
            Join for Free
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-12 mt-16 pt-16 border-t border-slate-800/50 w-full justify-center opacity-80 animate-in fade-in duration-1000 delay-500">
          <div className="flex flex-col items-center gap-2">
            <Activity className="w-6 h-6 text-indigo-400" />
            <span className="text-2xl font-bold">50k+</span>
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Students</span>
          </div>
          <div className="w-px h-12 bg-slate-800" />
          <div className="flex flex-col items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-400" />
            <span className="text-2xl font-bold">1,200+</span>
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Courses</span>
          </div>
          <div className="w-px h-12 bg-slate-800 hidden sm:block" />
          <div className="flex flex-col items-center gap-2 hidden sm:flex">
            <Users className="w-6 h-6 text-blue-400" />
            <span className="text-2xl font-bold">300+</span>
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Mentors</span>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="relative max-w-7xl mx-auto px-6 py-24 z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured <span className="text-indigo-400">Masterclasses</span></h2>
          <p className="text-slate-400 max-w-xl mx-auto">Hand-picked premium content crafted by industry experts.</p>
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
            {courses.slice(0, 6).map((course, i) => (
              <div key={course._id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both" style={{ animationDelay: `${i * 100}ms` }}>
                <CourseCard course={course} />
                <h2>{course.title}</h2>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="relative max-w-5xl mx-auto px-6 py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-[3rem] blur-xl" />
        <div className="relative bg-slate-900/50 border border-indigo-500/30 backdrop-blur-xl p-12 md:p-20 rounded-[3rem] text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 relative z-10">
            Ready to Start <span className="text-indigo-400">Learning?</span> 🎯
          </h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg relative z-10">
            Join thousands of students and unlock your full potential today. Create an account to get started.
          </p>
          <Link href="/register" className="relative z-10 inline-flex items-center gap-2 px-10 py-5 bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)]">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}