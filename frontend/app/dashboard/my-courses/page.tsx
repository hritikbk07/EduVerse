"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BookOpen, Loader2, GraduationCap, LayoutDashboard, ArrowRight } from "lucide-react";
import { useEnrollment } from "@/src/hooks/useEnrollment";

interface EnrolledCourse {
  _id: string;
  course: {
    _id: string;
    title: string;
    description: string;
    thumbnail?: string;
    price?: number;
  };
  progress: number;
}

export default function MyCoursesPage() {
  const { courses, loading, error, fetchEnrolledCourses } = useEnrollment();

  useEffect(() => {
    fetchEnrolledCourses();
  }, [fetchEnrolledCourses]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 relative overflow-hidden font-sans pb-24 pt-10">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-5%] w-[30%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors mb-8"
        >
          ← Back to Home
        </Link>

        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-blue-500/10 border border-indigo-500/20 rounded-2xl shadow-inner">
            <LayoutDashboard className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
              My Learning
            </h1>
            <p className="text-slate-400 mt-1">Pick up where you left off</p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-indigo-400">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <span className="font-semibold animate-pulse">Loading your courses...</span>
          </div>
        ) : error ? (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-8 rounded-2xl text-center">
            <p className="font-semibold mb-4">{error}</p>
            <button
              onClick={fetchEnrolledCourses}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500/20 hover:bg-rose-500/30 rounded-xl transition-colors text-sm font-bold"
            >
              Retry
            </button>
          </div>
        ) : courses.length === 0 ? (
          /* Empty State */
          <div className="relative group overflow-hidden rounded-3xl border border-slate-800/50 bg-slate-900/20 backdrop-blur-xl p-16 text-center max-w-2xl mx-auto mt-16">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-2xl rounded-3xl flex items-center justify-center transform rotate-3 group-hover:rotate-6 transition-transform duration-500">
                <GraduationCap className="w-10 h-10 text-indigo-400" />
              </div>
              <h2 className="text-3xl font-bold mb-4 text-white">No courses yet</h2>
              <p className="text-slate-400 mb-10 max-w-md mx-auto text-lg leading-relaxed">
                You haven&apos;t enrolled in any courses. Explore the catalog and start learning today.
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-100 hover:bg-white text-slate-950 font-bold rounded-2xl transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] duration-300"
              >
                Browse Courses <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(courses as EnrolledCourse[]).map((enrollment, idx) => {
              const course = enrollment.course;
              const progress = enrollment.progress ?? 0;

              return (
                <div
                  key={enrollment._id}
                  className="animate-in fade-in slide-in-from-bottom-6 duration-500 fill-mode-both"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  <div className="group relative flex flex-col h-full bg-slate-900/40 backdrop-blur-sm border border-slate-800 hover:border-indigo-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_-15px_rgba(99,102,241,0.3)]">
                    {/* Thumbnail */}
                    <div className="relative w-full h-44 overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 flex-shrink-0">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-14 h-14 text-slate-700" />
                        </div>
                      )}
                      {/* Progress badge */}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-full border border-indigo-500/30">
                        {progress}% done
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="font-bold text-lg text-white leading-tight mb-2 line-clamp-2 group-hover:text-indigo-200 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-slate-400 text-sm line-clamp-2 mb-4 flex-1">
                        {course.description}
                      </p>

                      {/* Progress bar */}
                      <div className="mt-auto">
                        <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                          <span className="font-semibold text-slate-400">Progress</span>
                          <span className="font-mono text-indigo-400 font-bold">{progress}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-700"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        <Link
                          href={`/courses/${course._id}`}
                          className="mt-4 w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20 hover:text-indigo-300 font-semibold text-sm transition-all duration-200"
                        >
                          Continue Learning <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
