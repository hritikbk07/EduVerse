"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  UserPlus,
} from "lucide-react";
import { useAuthStore } from "@/src/store/authStore";

const navItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Enrollments", href: "/admin/enrollments", icon: GraduationCap },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Create Instructor", href: "/admin/create-instructor", icon: UserPlus },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <span className="text-xl font-bold text-blue-600">EduVerse Admin</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-500"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={() => {
            logout();
            window.location.href = "/";
          }}
          className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-red-500" aria-hidden="true" />
          Logout
        </button>
      </div>
    </div>
  );
}
