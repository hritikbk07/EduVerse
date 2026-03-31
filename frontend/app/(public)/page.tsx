"use client";

import Navbar from "@/src/components/navbar/Navbar";
import { useCourses } from "@/src/hooks/useCourse";
import CourseCard from "@/src/components/course/CourseCard";

export default function HomePage() {
  const { courses, loading } = useCourses();

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="text-center py-16 bg-gray-100">
        <h1 className="text-4xl text-black font-bold">Learn Without Limits 🚀</h1>
        <p className="mt-4 text-gray-600">
          Upgrade your skills with top instructors
        </p>

        <button className="mt-6 bg-black text-white px-6 py-3 rounded-lg">
          Explore Courses
        </button>
      </section>

      {/* Featured Courses */}
      <section className="p-8">
        <h2 className="text-2xl font-semibold mb-6">Featured Courses</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-black text-white">
        <h2 className="text-2xl font-semibold">
          Start Learning Today 🎯
        </h2>
        <button className="mt-4 bg-white text-black px-6 py-2 rounded">
          Get Started
        </button>
      </section>
    </div>
  );
}