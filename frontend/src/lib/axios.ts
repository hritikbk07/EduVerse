import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  withCredentials: true
});

// Attach token automatically
API.interceptors.request.use((config) => {
  let token = localStorage.getItem("token");
  
  if (!token) {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        token = user.token || null;
      } catch (err) {}
    }
  }

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

export const getAdminStats = async () => {
  return await API.get("/api/admin/stats");
};

// Lesson APIs
export const uploadVideoFile = async (formData: FormData) => {
  return await API.post("/api/lesson/upload-video", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const createLesson = async (data: { title: string; courseId: string; videoUrl: string; publicId: string }) => {
  return await API.post("/api/lesson/create", data);
};

export const getLessonsByCourse = async (courseId: string) => {
  return await API.get(`/api/lesson/${courseId}`);
};

export default API;