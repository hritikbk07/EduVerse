import { useState, useCallback } from "react";
import { enrollCourse, getMyCourses } from "../lib/axios";

export const useEnrollment = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrolledCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyCourses();
      // Adjust this based on your actual API response structure (e.g. response.data.data)
      setCourses(response.data || response);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch enrolled courses");
    } finally {
      setLoading(false);
    }
  }, []);

  const enroll = async (courseId: string) => {
    setLoading(true);
    setError(null);
    try {
      await enrollCourse(courseId);
      await fetchEnrolledCourses(); // Refresh courses after successful enrollment
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to enroll in the course");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    courses,
    loading,
    error,
    fetchEnrolledCourses,
    enroll,
  };
};
