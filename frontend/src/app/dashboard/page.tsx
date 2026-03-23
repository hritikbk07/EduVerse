"use client"

import { useEffect, useState } from "react"
import api from "../../lib/axios"
import { ICourse } from "../../types"
import { useAuth } from "../../context/AuthContext"

export default function Dashboard() {
  const [courses, setCourses] = useState<ICourse[]>([])
  const { user, logout } = useAuth()

  useEffect(() => {
    const fetchCourses = async () => {
      const { data } = await api.get("/courses")
      setCourses(data)
    }
    fetchCourses()
  }, [])

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button onClick={logout} className="text-red-500">Logout</button>
      </div>

      <h2 className="text-lg font-semibold mb-2">Available Courses:</h2>
      <ul className="space-y-2">
        {courses.map((course) => (
          <li key={course._id} className="border p-2 rounded">
            <h3 className="font-bold">{course.title}</h3>
            <p>{course.description}</p>
            <p>Instructor: {course.instructor}</p>
            <p>Price: ${course.price}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}