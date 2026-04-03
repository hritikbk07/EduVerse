import React from "react";
import { Edit3, Trash, Sparkles } from "lucide-react";

export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
}

interface CourseCardProps {
  course: Course;
  onEdit?: (course: Course) => void;
  onDelete?: (courseId: string) => void;
}

export default function CourseCard({ course, onEdit, onDelete }: CourseCardProps) {
  return (
    <div className="group relative h-full flex flex-col justify-between overflow-hidden rounded-[2rem] bg-slate-900/50 border border-white/10 backdrop-blur-xl p-8 hover:bg-slate-800/50 hover:border-slate-700 hover:shadow-[0_0_40px_-15px_rgba(99,102,241,0.3)] transition-all duration-500">
      
      {/* Decorative gradient orb inside the card */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-colors duration-700" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <div className="p-3.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/20 rounded-2xl shadow-inner backdrop-blur-md">
            <Sparkles className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
          </div>
          
          <div className="flex items-center gap-2 opacity-0 -translate-y-2 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            {onEdit && (
              <button
                onClick={() => onEdit(course)}
                className="p-2.5 bg-slate-800/80 hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-300 border border-white/5 rounded-xl transition-all shadow-lg active:scale-95"
                title="Edit Course"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(course._id)}
                className="p-2.5 bg-slate-800/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-white/5 rounded-xl transition-all shadow-lg active:scale-95"
                title="Delete Course"
              >
                <Trash className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex-grow">
          <h3 className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 mb-3 line-clamp-2 leading-tight">
            {course.title}
          </h3>
          <p className="text-slate-400/90 text-[15px] leading-relaxed mb-6 line-clamp-3">
            {course.description}
          </p>
        </div>
        
        <div className="flex items-end justify-between mt-auto pt-6 border-t border-white/5">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider font-bold text-slate-500">
              Enrollment Price
            </span>
            <div className="font-mono text-3xl font-extrabold text-white tracking-tight">
              ${course.price.toFixed(2)}
            </div>
          </div>
          
          <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold uppercase tracking-widest shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]">
            Active
          </div>
        </div>
      </div>
    </div>
  );
}