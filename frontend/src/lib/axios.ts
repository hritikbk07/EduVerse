import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  withCredentials: true
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle global errors
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const enrollCourse = async (courseId: string) => {
  return await API.post(`/api/enrollments/enroll/${courseId}`);
};

export const getMyCourses = async () => {
  return await API.get("/api/enrollments/my-courses");
};

export default API;