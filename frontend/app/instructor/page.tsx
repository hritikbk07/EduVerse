"use client";

import { useEffect, useState } from "react";
import { Plus, X, Loader2, Compass } from "lucide-react";
import toast from "react-hot-toast";
import API from "@/src/lib/axios";
import CourseCard, { Course } from "@/src/components/course/CourseCard";
import { Skeleton } from "@/src/components/ui/Skeleton";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const [form, setForm] = useState<Partial<Course>>({
    title: "",
    description: "",
    price: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const getToken = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.token) return user.token;
      } catch (e) {}
    }
    return localStorage.getItem("token") || "";
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error("You are not logged in.");

      const res = await API.get("/api/courses/instructor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenCreate = () => {
    setForm({ title: "", description: "", price: 0 });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setForm({ title: course.title, description: course.description, price: course.price });
    setEditingId(course._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const token = getToken();
      await API.delete(`/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Course deleted successfully!", {
        style: {
          background: '#0f172a',
          color: '#fff',
          borderRadius: '12px',
        }
      });
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error deleting course");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = getToken();
      
      if (editingId) {
        await API.put(`/api/courses/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Course updated effectively!");
      } else {
        await API.post("/api/courses/create", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Brilliant! New course launched.");
      }
      
      setIsModalOpen(false);
      fetchCourses();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save course");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 relative overflow-hidden font-sans pb-24">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[30%] right-[-5%] w-[30%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 pt-16">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl backdrop-blur-md">
                <Compass className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-indigo-400 font-semibold tracking-wide uppercase text-sm">Instructor Hub</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
              Your Courses
            </h1>
            <p className="text-slate-400 mt-4 max-w-lg leading-relaxed text-lg">
              Craft, manage, and scale your educational content. Empower thousands of students around the globe.
            </p>
          </div>
          
          <button
            onClick={handleOpenCreate}
            className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 font-bold text-white transition-all duration-300 bg-gradient-to-r from-indigo-500 hover:from-indigo-600 to-blue-500 hover:to-blue-600 rounded-full shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.7)] hover:scale-[1.02] active:scale-95"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" />
            <span>Create Course</span>
          </button>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="relative w-full h-[280px] rounded-2xl overflow-hidden backdrop-blur-sm border border-slate-800/50 bg-slate-900/30 p-1">
                <Skeleton className="h-full w-full rounded-xl bg-slate-800/50" />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="relative group overflow-hidden rounded-3xl border border-slate-800/50 bg-slate-900/20 backdrop-blur-xl p-16 text-center max-w-3xl mx-auto mt-20">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-2xl rounded-3xl flex items-center justify-center transform rotate-3 group-hover:rotate-6 transition-transform duration-500">
                <Compass className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-white">The Canvas is Empty</h3>
              <p className="text-slate-400 mb-10 max-w-md mx-auto text-lg leading-relaxed">
                You haven't sculpted any content yet. Start your journey by creating a masterclass today.
              </p>
              <button
                onClick={handleOpenCreate}
                className="inline-flex relative items-center gap-2 px-8 py-4 bg-slate-100 hover:bg-white text-slate-950 font-bold rounded-2xl transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] duration-300"
              >
                Launch First Course
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((c, idx) => (
              <div 
                key={c._id} 
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <CourseCard course={c} onEdit={handleOpenEdit} onDelete={handleDelete} />
              </div>
            ))}
          </div>
        )}

        {/* Glassmorphic Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
              onClick={() => setIsModalOpen(false)}
            />
            
            {/* Modal Box */}
            <div className="relative w-full max-w-lg bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl shadow-indigo-500/10 rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300">
              
              {/* Modal Header */}
              <div className="px-8 py-6 flex items-center justify-between border-b border-white/5 bg-white/5">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                  {editingId ? "Refine Course" : "New Masterpiece"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Engaging Title</label>
                    <input
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-5 py-3.5 bg-black/40 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-slate-600 backdrop-blur-sm"
                      placeholder="e.g. Next.js 15: The Absolute Guide"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Deep Description</label>
                    <textarea
                      required
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full px-5 py-3.5 bg-black/40 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-slate-600 backdrop-blur-sm min-h-[120px] resize-none"
                      placeholder="What incredible things will students build?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">Price Value ($)</label>
                    <div className="relative">
                      <span className="absolute left-5 top-3.5 text-slate-500 font-bold">$</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-10 pr-5 py-3.5 bg-black/40 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white backdrop-blur-sm font-mono text-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-2 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 font-bold rounded-xl border border-slate-700/50 hover:bg-white/5 text-slate-300 transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-4 font-bold rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : editingId ? (
                      "Update Blueprint"
                    ) : (
                      "Publish Course"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}