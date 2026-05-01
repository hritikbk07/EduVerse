"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { enrollCourse } from "@/src/lib/axios";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import Navbar from "@/src/components/navbar/Navbar";

function SuccessContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const router = useRouter();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying payment and enrolling you in the course...");

  useEffect(() => {
    if (!courseId) {
      setStatus("error");
      setMessage("No course ID provided.");
      return;
    }

    const processEnrollment = async () => {
      try {
        await enrollCourse(courseId);
        setStatus("success");
        setMessage("Payment successful! You are now enrolled.");
        
        // Redirect to the dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard/my-courses");
        }, 3000);
      } catch (err: any) {
        // If already enrolled, we can still treat it as a success for the UX
        if (err?.response?.data?.message === 'Already enrolled in this course') {
          setStatus("success");
          setMessage("You are already enrolled in this course.");
          setTimeout(() => {
            router.push("/dashboard/my-courses");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(err?.response?.data?.message || "Failed to complete enrollment. Please contact support.");
        }
      }
    };

    processEnrollment();
  }, [courseId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-10 max-w-lg w-full shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        {status === "success" && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 blur-[80px] pointer-events-none" />
        )}
        {status === "error" && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-500/20 blur-[80px] pointer-events-none" />
        )}

        {status === "loading" && (
          <div className="flex flex-col items-center animate-pulse">
            <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Processing Payment...</h2>
            <p className="text-slate-400">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-4">
              Payment Successful!
            </h2>
            <p className="text-slate-300 text-lg mb-8">{message}</p>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Redirecting to your courses...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center animate-in fade-in duration-300">
            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
              <XCircle className="w-12 h-12 text-rose-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Oops, something went wrong</h2>
            <p className="text-slate-400 mb-8">{message}</p>
            <div className="flex gap-4">
              <Link
                href="/courses"
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center relative">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center">
             <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
             <p className="text-slate-400">Loading...</p>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </main>
    </div>
  );
}
