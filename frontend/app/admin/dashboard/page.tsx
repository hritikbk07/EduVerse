"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  BookOpen, 
  LayoutDashboard, 
  TrendingUp, 
  ArrowUpRight,
  Loader2,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/src/store/authStore";
import { getAllUsers, getAllCourses } from "@/src/lib/axios";

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    loading: true,
    error: null as string | null,
  });

  useEffect(() => {
    // Protection: Only admins can access
    if (!user || user.role !== "admin") {
      router.replace("/login");
      return;
    }

    const fetchStats = async () => {
      try {
        const [usersRes, coursesRes] = await Promise.all([
          getAllUsers(),
          getAllCourses()
        ]);

        setStats({
          totalUsers: usersRes.data.count || 0,
          totalCourses: coursesRes.data.count || 0,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        console.error("Dashboard Fetch Error:", err);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: "Failed to load dashboard statistics.",
        }));
        toast.error("Could not fetch administrative data.");
      }
    };

    fetchStats();
  }, [user, router]);

  if (stats.loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-indigo-400">
          <Loader2 className="w-10 h-10 animate-spin" />
          <span className="font-semibold animate-pulse tracking-widest uppercase text-xs">Initializing Admin Hub...</span>
        </div>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl max-w-md text-center backdrop-blur-xl">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Error</h2>
          <p className="text-slate-400 mb-6">{stats.error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all font-bold"
          >
            Retry Connection
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
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl backdrop-blur-md">
                <LayoutDashboard className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="text-indigo-400 font-semibold tracking-wide uppercase text-sm">System Overview</h2>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white via-slate-100 to-slate-400">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-4 max-w-lg leading-relaxed text-lg">
              Manage users, courses, and platform activity from a centralized hub.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/50 backdrop-blur-md p-2 rounded-2xl border border-slate-800/50">
            <div className="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-xl text-sm font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Live Performance
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {/* Users Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl p-8 transition-all hover:border-indigo-500/30 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.2)]">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-24 h-24 text-indigo-400" />
            </div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-indigo-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-5xl font-black tracking-tighter text-white">
                  {stats.totalUsers}
                </h3>
                <span className="text-indigo-400 font-bold flex items-center gap-1 text-sm bg-indigo-400/10 px-2 py-0.5 rounded-lg">
                  <ArrowUpRight className="w-4 h-4" />
                  Active
                </span>
              </div>
              <p className="text-slate-400 font-medium mt-2 text-lg">Total Users Registered</p>
            </div>
          </div>

          {/* Courses Card */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl p-8 transition-all hover:border-blue-500/30 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)]">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <BookOpen className="w-24 h-24 text-blue-400" />
            </div>
            
            <div className="relative z-10">
              <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7 text-blue-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-5xl font-black tracking-tighter text-white">
                  {stats.totalCourses}
                </h3>
                <span className="text-blue-400 font-bold flex items-center gap-1 text-sm bg-blue-400/10 px-2 py-0.5 rounded-lg">
                  <ArrowUpRight className="w-4 h-4" />
                  Live
                </span>
              </div>
              <p className="text-slate-400 font-medium mt-2 text-lg">Courses Launched</p>
            </div>
          </div>
        </div>

        {/* Quick Actions / Future Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <div className="bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl p-12 text-center">
            <h4 className="text-slate-500 font-semibold uppercase tracking-widest text-xs mb-2">Upcoming Modules</h4>
            <div className="flex flex-wrap justify-center gap-8">
              {['User Logs', 'Revenue Tracker', 'Course Approval Queue', 'System Health'].map((item) => (
                <div key={item} className="text-slate-600 text-sm font-medium border border-slate-800/50 px-4 py-2 rounded-full bg-slate-900/40">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
