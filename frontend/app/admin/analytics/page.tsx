"use client";

import React, { useEffect, useState } from "react";
import { getAdminStats } from "@/src/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/Card";
import toast from "react-hot-toast";
import {
  Loader2,
  TrendingUp,
  Users,
  BarChart3,
  DollarSign,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PIE_COLORS = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const CATEGORY_DATA = [
  { name: "Web Dev", value: 35 },
  { name: "Data Science", value: 25 },
  { name: "Design", value: 15 },
  { name: "Mobile", value: 15 },
  { name: "Other", value: 10 },
];

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAdminStats();
        setStats(res.data);
      } catch (err: any) {
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const chartData = stats?.chartData || [];
  const totalRevenue = stats?.totalRevenue || 0;
  const totalUsers = stats?.totalUsers || 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">
          In-depth platform performance metrics and growth trends.
        </p>
      </div>

      {/* KPI Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            icon: DollarSign,
            color: "text-green-600",
            bg: "bg-green-50",
            change: "+12% vs last month",
          },
          {
            label: "Total Users",
            value: totalUsers.toLocaleString(),
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50",
            change: "+8% vs last month",
          },
          {
            label: "Total Courses",
            value: (stats?.totalCourses || 0).toLocaleString(),
            icon: BarChart3,
            color: "text-purple-600",
            bg: "bg-purple-50",
            change: "+5 this month",
          },
          {
            label: "Enrollments",
            value: (stats?.totalEnrollments || 0).toLocaleString(),
            icon: TrendingUp,
            color: "text-orange-600",
            bg: "bg-orange-50",
            change: "+18% vs last month",
          },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{kpi.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                  <p className="text-xs text-green-600 mt-1 font-medium">{kpi.change}</p>
                </div>
                <div className={`h-10 w-10 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            Revenue Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#6366f1"
                strokeWidth={2.5}
                fill="url(#revGrad)"
                name="Revenue ($)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Two charts side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Monthly User Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "#f1f5f9" }}
                  contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                />
                <Bar dataKey="users" fill="#3b82f6" radius={[6, 6, 0, 0]} name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Course Category Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              Course Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={CATEGORY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {CATEGORY_DATA.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue vs Users Combined Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-green-500" />
            Revenue vs User Growth Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5} dot={{ r: 4 }} name="Revenue ($)" />
              <Line type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} name="New Users" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
