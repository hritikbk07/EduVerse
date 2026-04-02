"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/src/lib/axios";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/api/auth/login", form);

      const { token, ...user } = res.data;
      // console.log(res.data);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(res.data));

      // 🔥 Role-based redirect
      if (user.role === "student") router.push("/dashboard");
      else if (user.role === "instructor") router.push("/instructor");
      else if (user.role === "admin") router.push("/admin");

    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-90"
      >
        <h2 className="text-2xl text-black font-bold mb-6 text-center">
          Login to Eduverse
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email" 
          required
          onChange={handleChange}
          className="w-full mb-4 p-3 border text-black rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          onChange={handleChange}
          className="w-full mb-4 p-3 text-black border rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-black text-center mt-4">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 font-semibold">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}