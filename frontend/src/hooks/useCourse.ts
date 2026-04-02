import { useEffect, useState } from "react";
import API from "@/src/lib/axios";

export interface Course {
  _id: string;
  title: string;
  description: string;
  price: number;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await API.get("/api/courses");
        setCourses(res.data);
      } catch (err: any) {
        console.error(err);
        setError("Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading, error };
};