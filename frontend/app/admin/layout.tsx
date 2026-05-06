"use client";

import React, { useState } from "react";
import ProtectedRoute from "@/src/components/ProtectedRoute";
import { AdminSidebar } from "@/src/components/admin/AdminSidebar";
import { Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <AdminSidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div
              className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
            <div className="relative flex w-full max-w-xs flex-1 flex-col pt-5 pb-4">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <X className="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
              <AdminSidebar />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile Header */}
          <div className="md:hidden flex h-16 items-center justify-between bg-white px-4 border-b border-gray-200">
            <span className="text-xl font-bold text-blue-600">EduVerse Admin</span>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Main scrollable area */}
          <main className="flex-1 overflow-y-auto focus:outline-none p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
