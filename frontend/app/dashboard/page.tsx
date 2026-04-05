"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    } else if (user.role === "student") {
      router.replace("/dashboard/my-courses");
    } else if (user.role === "instructor") {
      router.replace("/instructor");
    } else if (user.role === "admin") {
      router.replace("/admin");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-indigo-400">
        <Loader2 className="w-10 h-10 animate-spin" />
        <span className="font-semibold animate-pulse">Redirecting...</span>
      </div>
    </div>
  );
}
