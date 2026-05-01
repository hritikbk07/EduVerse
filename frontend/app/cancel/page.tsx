"use client";

import Link from "next/link";
import Navbar from "@/src/components/navbar/Navbar";
import { XCircle } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center relative px-4">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-10 max-w-lg w-full shadow-2xl relative overflow-hidden text-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 blur-[80px] pointer-events-none" />

          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-12 h-12 text-amber-400" />
          </div>
          
          <h2 className="text-3xl font-extrabold text-white mb-4">Payment Cancelled</h2>
          <p className="text-slate-400 text-lg mb-8">
            Your checkout process was interrupted or cancelled. No charges were made.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link
              href="/courses"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors font-semibold"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
