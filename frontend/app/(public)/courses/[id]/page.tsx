"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import API from "@/src/lib/axios";
import { enrollCourse } from "@/src/lib/axios";
import Navbar from "@/src/components/navbar/Navbar";
import { useAuthStore } from "@/src/store/authStore";
import { BookOpen, GraduationCap, Loader2, CheckCircle2, XCircle } from "lucide-react";

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnail?: string;
}

type EnrollStatus = "idle" | "loading" | "success" | "error";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.id as string;
  const { user } = useAuthStore();
  const isStudent = user?.role === "student";

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [enrollStatus, setEnrollStatus] = useState<EnrollStatus>("idle");
  const [enrollMessage, setEnrollMessage] = useState<string>("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await API.get(`/api/courses/${courseId}`);
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

  const handleEnroll = async () => {
    setEnrollStatus("loading");
    setEnrollMessage("");
    try {
      await enrollCourse(courseId);
      setEnrollStatus("success");
      setEnrollMessage("🎉 You're enrolled! Head to My Courses to start learning.");
    } catch (err: any) {
      setEnrollStatus("error");
      setEnrollMessage(
        err?.response?.data?.message || "Failed to enroll. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-indigo-400">
          <Loader2 className="w-10 h-10 animate-spin" />
          <span className="font-semibold animate-pulse">Loading course...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-8 rounded-2xl text-center max-w-md">
          <XCircle className="w-12 h-12 mx-auto mb-4 opacity-70" />
          <p className="font-semibold text-lg">{error}</p>
          <Link href="/courses" className="mt-6 inline-block text-sm text-slate-400 hover:text-slate-300 transition-colors">
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-400">
        Course not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-10 pb-24">
        {/* Back */}
        <Link href="/courses" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors mb-8 text-sm">
          ← Back to Courses
        </Link>

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/60 bg-slate-900/40 backdrop-blur-xl shadow-2xl mb-8">
          {/* Thumbnail */}
          {course.thumbnail ? (
            <div className="relative w-full h-64 sm:h-80 overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
            </div>
          ) : (
            <div className="w-full h-52 bg-gradient-to-br from-indigo-900/40 to-slate-900 flex items-center justify-center border-b border-slate-800">
              <BookOpen className="w-20 h-20 text-slate-700" />
            </div>
          )}

          {/* Course Info */}
          <div className="p-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 leading-tight mb-4">
              {course.title}
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-6">
              {course.description}
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <span className="bg-emerald-500/10 text-emerald-400 font-mono font-bold px-4 py-2 rounded-xl border border-emerald-500/20 text-lg">
                Rs {course.price}
              </span>
            </div>
          </div>
        </div>

        {/* Enroll Section — student only */}
        {isStudent && (
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 text-center">
            <GraduationCap className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Ready to start learning?</h2>
            <p className="text-slate-400 mb-6">Join thousands of students already enrolled in this course.</p>

            {/* Status Message */}
            {enrollStatus === "success" && (
              <div className="flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-3.5 rounded-xl mb-5 font-semibold">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                {enrollMessage}
              </div>
            )}
            {enrollStatus === "error" && (
              <div className="flex items-center justify-center gap-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-5 py-3.5 rounded-xl mb-5 font-semibold">
                <XCircle className="w-5 h-5 shrink-0" />
                {enrollMessage}
              </div>
            )}

            {/* Enroll Button */}
            {enrollStatus !== "success" && (
              <button
                id="enroll-now-btn"
                onClick={handleEnroll}
                disabled={enrollStatus === "loading"}
                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold rounded-2xl transition-all duration-300 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.7)] hover:scale-[1.03] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed text-lg"
              >
                {enrollStatus === "loading" ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  <>
                    <GraduationCap className="w-5 h-5" />
                    Enroll Now
                  </>
                )}
              </button>
            )}

            {enrollStatus === "success" && (
              <Link
                href="/dashboard/my-courses"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-100 hover:bg-white text-slate-950 font-bold rounded-2xl transition-all hover:scale-105 duration-300"
              >
                Go to My Courses →
              </Link>
            )}
          </div>
        )}

        {/* Lessons Placeholder */}
        <div className="mt-8 bg-slate-900/30 border border-slate-800/50 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Course Curriculum
          </h2>
          <p className="text-slate-500">Lessons will appear here once added by the instructor.</p>
        </div>
      </main>
    </div>
  );
}