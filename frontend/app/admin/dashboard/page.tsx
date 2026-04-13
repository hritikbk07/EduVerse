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
  AlertCircle,
  CircleDollarSign,
  GraduationCap,
  Clock,
  PlayCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/src/store/authStore";
import { getAdminStats } from "@/src/lib/axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalRevenue: 0,
    recentUsers: [] as any[],
    recentCourses: [] as any[],
    chartData: [] as any[],
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
        const res = await getAdminStats();
        
        setStats({
          totalUsers: res.data.totalUsers || 0,
          totalCourses: res.data.totalCourses || 0,
          totalEnrollments: res.data.totalEnrollments || 0,
          totalRevenue: res.data.totalRevenue || 0,
          recentUsers: res.data.recentUsers || [],
          recentCourses: res.data.recentCourses || [],
          chartData: res.data.chartData || [],
          loading: false,
          error: null,
        });
      } catch (err: any) {
        console.error("Dashboard Fetch Error:", err);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: err.response?.data?.message || "Failed to load dashboard statistics.",
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
              Monitor key metrics and real-time performance across the entire EduVerse platform.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/50 backdrop-blur-md p-2 rounded-2xl border border-slate-800/50">
            <div className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-xl text-sm font-bold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Data Synced
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Card 1: Users */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl p-6 transition-all hover:border-indigo-500/30 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.15)]">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users className="w-20 h-20 text-indigo-400" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-4xl font-black tracking-tighter text-white mb-1">
                {stats.totalUsers.toLocaleString()}
              </h3>
              <p className="text-slate-400 font-medium text-sm">Total Users</p>
            </div>
          </div>

          {/* Card 2: Courses */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl p-6 transition-all hover:border-blue-500/30 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.15)]">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BookOpen className="w-20 h-20 text-blue-400" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-4xl font-black tracking-tighter text-white mb-1">
                {stats.totalCourses.toLocaleString()}
              </h3>
              <p className="text-slate-400 font-medium text-sm">Active Courses</p>
            </div>
          </div>

          {/* Card 3: Enrollments */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl p-6 transition-all hover:border-purple-500/30 hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.15)]">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <GraduationCap className="w-20 h-20 text-purple-400" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-4xl font-black tracking-tighter text-white mb-1">
                {stats.totalEnrollments.toLocaleString()}
              </h3>
              <p className="text-slate-400 font-medium text-sm">Total Enrollments</p>
            </div>
          </div>

          {/* Card 4: Revenue */}
          <div className="group relative overflow-hidden rounded-3xl border border-slate-800/50 bg-slate-900/40 backdrop-blur-xl p-6 transition-all hover:border-emerald-500/30 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.15)]">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CircleDollarSign className="w-20 h-20 text-emerald-400" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mb-4">
                <CircleDollarSign className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-4xl font-black tracking-tighter text-white mb-1">
                ${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h3>
              <p className="text-slate-400 font-medium text-sm">Total Revenue</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Revenue & Users Area Chart */}
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" /> Revenue & Growth Trend
              </h3>
            </div>
            <div className="w-full">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="users" stroke="#6366f1" fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Signups Bar Chart */}
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" /> Monthly User Registrations
              </h3>
            </div>
            <div className="w-full">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis stroke="#64748b" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#1e293b' }}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                  />
                  <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 backdrop-blur-xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-400" /> Recent Signups
            </h3>
            <div className="flex flex-col gap-4">
              {stats.recentUsers.length > 0 ? (
                stats.recentUsers.map((u, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 hover:border-indigo-500/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{u.name}</p>
                        <p className="text-slate-400 text-xs">{u.email}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      u.role === 'admin' ? 'bg-red-500/10 text-red-400' :
                      u.role === 'instructor' ? 'bg-amber-500/10 text-amber-400' :
                      'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {u.role}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm italic">No recent users found.</p>
              )}
            </div>
          </div>

          {/* Recent Courses */}
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 backdrop-blur-xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-blue-400" /> Recently Added Courses
            </h3>
            <div className="flex flex-col gap-4">
              {stats.recentCourses.length > 0 ? (
                stats.recentCourses.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 hover:border-blue-500/30 transition-colors">
                    <div className="flex flex-col max-w-[70%]">
                      <p className="text-white font-medium text-sm truncate">{c.title}</p>
                      <p className="text-slate-400 text-xs">Instructor: {c.instructor?.name || 'Unknown'}</p>
                    </div>
                    <div className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 py-1 rounded-full">
                      ${c.price?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm italic">No recent courses found.</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
