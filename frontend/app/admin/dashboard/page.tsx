"use client";

import { useEffect, useState } from "react";
import {
  Users,
  BookOpen,
  TrendingUp,
  CircleDollarSign,
  GraduationCap,
  Clock,
  PlayCircle,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { getAdminStats } from "@/src/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/Card";
import { Badge } from "@/src/components/ui/Badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function AdminDashboard() {
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
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: err.response?.data?.message || "Failed to load statistics.",
        }));
        toast.error("Could not fetch dashboard data.");
      }
    };
    fetchStats();
  }, []);

  if (stats.loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-red-500 font-medium">{stats.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-blue-600 hover:underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      bg: "bg-blue-50",
      color: "text-blue-600",
    },
    {
      label: "Total Courses",
      value: stats.totalCourses.toLocaleString(),
      icon: BookOpen,
      bg: "bg-indigo-50",
      color: "text-indigo-600",
    },
    {
      label: "Total Enrollments",
      value: stats.totalEnrollments.toLocaleString(),
      icon: GraduationCap,
      bg: "bg-purple-50",
      color: "text-purple-600",
    },
    {
      label: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: CircleDollarSign,
      bg: "bg-green-50",
      color: "text-green-600",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Platform overview and key performance metrics.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.label} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className={`h-10 w-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={stats.chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0" }} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fill="url(#revGrad)" name="Revenue ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Growth Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-blue-500" />
              User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0" }}
                />
                <Bar dataKey="users" fill="#6366f1" radius={[4, 4, 0, 0]} name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-indigo-500" />
              Recent Signups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentUsers.length > 0 ? (
                stats.recentUsers.map((u: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        u.role === "admin"
                          ? "danger"
                          : u.role === "instructor"
                          ? "warning"
                          : "success"
                      }
                    >
                      {u.role}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">No recent users.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PlayCircle className="h-4 w-4 text-blue-500" />
              Recently Added Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentCourses.length > 0 ? (
                stats.recentCourses.map((c: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                        <BookOpen className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{c.title}</p>
                        <p className="text-xs text-gray-500">by {c.instructor?.name || "Unknown"}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-green-600 shrink-0 ml-3">
                      {c.price === 0 ? "Free" : `$${c.price?.toFixed(2)}`}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center py-6">No recent courses.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
