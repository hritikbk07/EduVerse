import { useEffect, useState } from "react";
import API from "@/src/lib/axios";

export const useLessons = (courseId: string) => {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await API.get(`/api/lessons/${courseId}`);
        setLessons(res.data);
      } catch (error) {
        console.error("Error fetching lessons", error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchLessons();
  }, [courseId]);

  return { lessons, loading };
};