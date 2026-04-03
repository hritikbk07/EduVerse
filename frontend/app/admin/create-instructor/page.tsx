"use client";

import { useState } from "react";
import API from "@/src/lib/axios";
import { User, Mail, Lock, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function CreateInstructorPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/api/admin/create-instructor", form);
      toast.success(res.data.message || "Instructor created successfully!", {
        style: { background: '#0f172a', color: '#fff', borderRadius: '12px' }
      });
      setForm({ name: "", email: "", password: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create instructor", {
        style: { background: '#0f172a', color: '#f43f5e', borderRadius: '12px' }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex bg-[#020617] text-slate-100 flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-10 shadow-2xl rounded-[2.5rem]">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold tracking-wider text-xs uppercase mb-4">
                <ShieldCheck className="w-4 h-4" />
                Admin Panel
              </div>
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                Create Instructor
              </h2>
              <p className="text-slate-400 mt-2">Provision a powerful new instructor account.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Instructor Name</label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Dr. Ada Lovelace"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-3.5 bg-black/40 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white placeholder-slate-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  placeholder="instructor@eduverse.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-3.5 bg-black/40 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white placeholder-slate-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">Temporary Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-5 py-3.5 bg-black/40 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-white placeholder-slate-600 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full group mt-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white p-4 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(16,185,129,0.5)] active:scale-[0.98]"
            >
             {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Provision Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="mt-8 text-center">
            <Link href="/" className="text-slate-500 hover:text-white font-medium transition-colors text-sm">
                ← Back to Homepage
            </Link>
        </div>
      </div>
    </div>
  );
}