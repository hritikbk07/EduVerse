"use client";

import { useAuthStore } from "@/src/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedInstructor({ children }: any) {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "instructor") {
      router.push("/login");
    }
  }, [user]);

  return children;
}