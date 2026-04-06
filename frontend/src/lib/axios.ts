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

// Admin APIs
export const getAllUsers = async () => {
  return await API.get("/api/admin/users");
};

export const updateUserRole = async (userId: string, role: string) => {
  return await API.patch(`/api/admin/users/${userId}/role`, { role });
};

export const deleteUser = async (userId: string) => {
  return await API.delete(`/api/admin/users/${userId}`);
};

export const getAllCourses = async () => {
  return await API.get("/api/admin/courses");
};

export const deleteCourse = async (courseId: string) => {
  return await API.delete(`/api/admin/courses/${courseId}`);
};

export default API;