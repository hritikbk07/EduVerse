"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  BookOpen, 
  Trash2, 
  Loader2, 
  AlertCircle, 
  User, 
  Mail,
  ChevronRight,
  Search,
  LayoutDashboard
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/src/store/authStore";
import { getAllCourses, deleteCourse } from "@/src/lib/axios";

interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
  instructor: {
    _id: string;
    name: string;
    email: string;
  } | null;
  createdAt: string;
}

export default function AdminCoursesPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    // Protection: Only admins can access
    if (!user || user.role !== "admin") {
      router.replace("/login");
      return;
    }

    fetchCourses();
  }, [user, router]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await getAllCourses();
      setCourses(res.data.courses || []);
      setError(null);
    } catch (err: any) {
      console.error("Fetch Courses Error:", err);
      setError("Failed to load courses. Please try again later.");
      toast.error("Could not fetch course data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(courseId);
      await deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      toast.success("Course deleted successfully.");
    } catch (err: any) {
      console.error("Delete Course Error:", err);
      toast.error(err.response?.data?.message || "Failed to delete course.");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-indigo-400">
          <Loader2 className="w-10 h-10 animate-spin" />
          <span className="font-semibold animate-pulse tracking-widest uppercase text-xs">Loading Courses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl max-w-md text-center backdrop-blur-xl">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button 
            onClick={fetchCourses}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all font-bold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 relative overflow-hidden font-sans pb-24">
      {/* Dynamic Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 pt-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div 
                onClick={() => router.push("/admin/dashboard")}
                className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl backdrop-blur-md cursor-pointer hover:bg-indigo-500/20 transition-all"
              >
                <LayoutDashboard className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-indigo-400 font-semibold tracking-wide uppercase text-sm">Administration</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white via-slate-100 to-slate-400">
              Manage Courses
            </h1>
            <p className="text-slate-400 mt-4 max-w-lg leading-relaxed text-lg">
              Monitor, review, and manage all courses published on EduVerse.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-indigo-400 transition-colors">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Search by title or instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all backdrop-blur-md"
            />
          </div>
        </div>

        {/* Courses Table/List */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/50 bg-slate-800/20">
                  <th className="px-8 py-6 font-semibold text-slate-400 text-sm uppercase tracking-wider">Course Detail</th>
                  <th className="px-8 py-6 font-semibold text-slate-400 text-sm uppercase tracking-wider">Instructor</th>
                  <th className="px-8 py-6 font-semibold text-slate-400 text-sm uppercase tracking-wider">Pricing</th>
                  <th className="px-8 py-6 font-semibold text-slate-400 text-sm uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <tr 
                      key={course._id}
                      className="group hover:bg-white/2 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center shrink-0">
                            <BookOpen className="w-6 h-6 text-indigo-400" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">{course.title}</h3>
                            <p className="text-slate-500 text-xs mt-1">ID: {course._id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {course.instructor ? (
                          <div className="flex flex-col">
                            <span className="flex items-center gap-2 text-slate-200 font-medium whitespace-nowrap">
                              <User className="w-3.5 h-3.5 text-indigo-400" />
                              {course.instructor.name}
                            </span>
                            <span className="flex items-center gap-2 text-slate-500 text-xs mt-1">
                              <Mail className="w-3.5 h-3.5" />
                              {course.instructor.email}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-600 text-sm italic">Unknown Instructor</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-sm font-bold">
                          ${course.price.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => handleDelete(course._id, course.title)}
                          disabled={deletingId === course._id}
                          className="inline-flex items-center justify-center w-10 h-10 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                        >
                          {deletingId === course._id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center">
                          <BookOpen className="w-8 h-8 text-slate-600" />
                        </div>
                        <h3 className="text-slate-400 font-medium">No courses found</h3>
                        <p className="text-slate-600 text-sm">Try adjusting your search or check back later.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Placeholder / Footer */}
        <div className="mt-8 flex justify-between items-center text-slate-500 text-sm">
          <p>Showing {filteredCourses.length} of {courses.length} total courses</p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            Live Management Active
          </div>
        </div>
      </div>
    </div>
  );
}
