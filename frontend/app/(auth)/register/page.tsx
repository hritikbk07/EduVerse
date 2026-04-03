"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/src/lib/axios";
import Link from "next/link";
import { Mail, Lock, UserPlus, ArrowRight, BookOpen, Loader2, User, UserCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // default role
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/api/auth/register", form);

      toast.success("Registration successful 🎉", {
        style: { background: '#0f172a', color: '#fff', borderRadius: '12px' }
      });

      // Redirect to login
      router.push("/login");

    } catch (err: any) {
       toast.error(err.response?.data?.message || "Registration failed", {
        style: { background: '#0f172a', color: '#f43f5e', borderRadius: '12px' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[50%] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-3 group z-20">
        <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl backdrop-blur-md">
          <BookOpen className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
        </div>
        <span className="font-extrabold text-xl text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">
          EduVerse
        </span>
      </Link>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-8 shadow-2xl rounded-[2.5rem]">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/20 shadow-inner rounded-2xl flex items-center justify-center transform rotate-3">
            <UserPlus className="w-8 h-8 text-indigo-400" />
          </div>
          
          <h2 className="text-3xl font-extrabold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
            Join Eduverse
          </h2>
          <p className="text-slate-400 text-center mb-8 font-medium">Create your account to start learning</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Account Type</label>
              <div className="relative">
                <UserCircle className="absolute left-4 top-3.5 w-5 h-5 text-slate-500 pointer-events-none" />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-3.5 bg-black/40 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white font-medium appearance-none"
                >
                  <option value="student" className="bg-slate-900">Student</option>
                  <option value="instructor" className="bg-slate-900">Instructor</option>
                  <option value="admin" className="bg-slate-900">Admin (dev only)</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  required
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-3.5 bg-black/40 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-slate-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-3.5 bg-black/40 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-slate-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-3.5 bg-black/40 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-slate-600 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white p-4 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] active:scale-[0.98]"
            >
             {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-slate-400 text-center mt-8 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-bold ml-1 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}