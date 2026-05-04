"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/authStore";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (!user) {
      router.replace("/login");
    } else if (allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect based on role if they try to access an unauthorized route
      if (user.role === "student") router.replace("/dashboard/my-courses");
      else if (user.role === "instructor") router.replace("/instructor");
      else if (user.role === "admin") router.replace("/admin");
      else router.replace("/");
    }
  }, [user, isMounted, router, allowedRoles]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) return null;

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-indigo-400">
          <Loader2 className="w-10 h-10 animate-spin" />
          <span className="font-semibold animate-pulse">Redirecting...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
