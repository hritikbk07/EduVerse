"use client";

import { useState, useEffect } from "react";
import axios from "@/src/lib/axios";
import { BookOpen, User, DollarSign, ArrowRight, Loader2, RefreshCw, Layers } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

interface Course {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    instructor: "",
    price: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post("/api/courses/create", form);
      toast.success("Course created successfully!", {
        style: { background: '#0f172a', color: '#fff', borderRadius: '12px' }
      });
      setForm({ title: "", description: "", instructor: "", price: 0 });
      fetchCourses();
    } catch (err: any) {
      toast.error("Failed to create course. Check if all fields are filled.", {
        style: { background: '#0f172a', color: '#f43f5e', borderRadius: '12px' }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-6 relative overflow-hidden pb-24 pt-20 flex flex-col items-center">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-5xl relative z-10">
        <Link href="/" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors mb-8 text-sm">
          ← Back to Homepage
        </Link>

        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-blue-500/10 border border-indigo-500/20 rounded-2xl shadow-inner">
            <Layers className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Course Management</h1>
            <p className="text-slate-400">Manage and publish new content</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Form Section */}
          <section className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 shadow-2xl rounded-3xl h-fit">
            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              Create New Course
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Course Title</label>
                <input name="title" placeholder="e.g. Next.js Masterclass" value={form.title} onChange={handleChange} className="w-full px-5 py-3.5 bg-black/40 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-slate-600 transition-all font-medium" required />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Instructor Name (ID)</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input name="instructor" placeholder="Instructor ID" value={form.instructor} onChange={handleChange} className="w-full pl-12 pr-5 py-3.5 bg-black/40 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-slate-600 transition-all font-medium" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Description</label>
                <textarea name="description" placeholder="What will students learn?" value={form.description} onChange={handleChange} className="w-full px-5 py-3.5 bg-black/40 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-slate-600 transition-all font-medium min-h-[100px] resize-y" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Price ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                  <input name="price" type="number" step="0.01" min="0" placeholder="0.00" value={form.price} onChange={handleChange} className="w-full pl-12 pr-5 py-3.5 bg-black/40 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-slate-600 transition-all font-mono font-bold" />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full group mt-4 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white p-4 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] active:scale-[0.98]">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Publish Course <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            </form>
          </section>

          {/* List Section */}
          <section className="flex flex-col">
            <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-400" />
              Active Catalog
            </h2>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-indigo-400">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <span className="font-semibold animate-pulse">Loading directory...</span>
              </div>
            ) : error ? (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-6 rounded-2xl text-center">
                <p className="font-semibold mb-4">{error}</p>
                <button onClick={fetchCourses} className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 rounded-xl transition-colors text-sm font-bold">
                  <RefreshCw className="w-4 h-4" /> Retry Connection
                </button>
              </div>
            ) : courses.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border border-slate-800/50 bg-slate-900/20 rounded-3xl backdrop-blur-sm p-8">
                <BookOpen className="w-12 h-12 text-slate-700 mb-4" />
                <p className="text-slate-400 font-medium">No courses in the catalog yet.</p>
                <p className="text-slate-500 text-sm mt-1">Publish your first one using the panel.</p>
              </div>
            ) : (
              <div className="grid gap-4 auto-rows-max overflow-y-auto pr-2 max-h-[800px] custom-scrollbar">
                {courses.map((c, idx) => (
                  <div key={c._id} className="bg-slate-900/40 p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/60 transition-all duration-300 animate-in fade-in slide-in-from-right-4 fill-mode-both" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-bold text-lg text-white mb-1 leading-tight">{c.title}</h3>
                        <p className="text-slate-400 text-sm line-clamp-2 mb-3">{c.description}</p>
                      </div>
                      <div className="bg-emerald-500/10 text-emerald-400 font-mono font-bold px-3 py-1.5 rounded-lg border border-emerald-500/20 text-sm whitespace-nowrap">
                        ${c.price}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-3 border-t border-slate-800">
                      <span className="font-mono bg-black/50 px-2 py-1 rounded">ID: {c._id}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}