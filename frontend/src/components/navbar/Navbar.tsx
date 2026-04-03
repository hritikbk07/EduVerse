import Link from "next/link";
import { BookOpen, LogIn, Compass } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl shadow-inner group-hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.4)] transition-all duration-300">
            <BookOpen className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
          </div>
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">
            EduVerse
          </h1>
        </Link>

        {/* Links */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
            Home
          </Link>
          <Link href="/courses" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors duration-200 flex items-center gap-2">
            <Compass className="w-4 h-4" />
            Explore
          </Link>
          <Link href="/login" className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.7)] hover:scale-105">
            <LogIn className="w-4 h-4" />
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;