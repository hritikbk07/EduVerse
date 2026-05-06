"use client";

import React, { useEffect, useState } from "react";
import { getAllCourses, deleteCourse, toggleCoursePublish } from "@/src/lib/axios";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/src/components/ui/Table";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import toast from "react-hot-toast";
import { Loader2, Search, Trash2, Globe, EyeOff, BookOpen } from "lucide-react";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await getAllCourses();
      setCourses(res.data.courses || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    try {
      await deleteCourse(id);
      toast.success("Course deleted successfully");
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete course");
    }
  };

  const handleTogglePublish = async (id: string, currentlyPublished: boolean) => {
    try {
      await toggleCoursePublish(id);
      toast.success(`Course ${currentlyPublished ? "unpublished" : "published"} successfully`);
      setCourses((prev) =>
        prev.map((c) => (c._id === id ? { ...c, isPublished: !c.isPublished } : c))
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update course status");
    }
  };

  const filtered = courses.filter(
    (c) =>
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all platform courses, publish status, and access.</p>
        </div>
        <Button onClick={fetchCourses} variant="outline">Refresh</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Courses</p>
            <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
            <Globe className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Published</p>
            <p className="text-2xl font-bold text-gray-900">{courses.filter((c) => c.isPublished).length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-yellow-50 flex items-center justify-center">
            <EyeOff className="h-5 w-5 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Drafts</p>
            <p className="text-2xl font-bold text-gray-900">{courses.filter((c) => !c.isPublished).length}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by title or instructor..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Title</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    No courses found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((course) => (
                  <TableRow key={course._id}>
                    <TableCell className="font-medium text-gray-900 max-w-xs truncate">
                      {course.title}
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {course.instructor?.name || "Unknown"}
                    </TableCell>
                    <TableCell className="text-gray-700 font-medium">
                      {course.price === 0 ? (
                        <span className="text-green-600 font-semibold">Free</span>
                      ) : (
                        `$${Number(course.price).toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell>
                      {course.isPublished ? (
                        <Badge variant="success">Published</Badge>
                      ) : (
                        <Badge variant="warning">Draft</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePublish(course._id, course.isPublished)}
                        title={course.isPublished ? "Unpublish" : "Publish"}
                        className={
                          course.isPublished
                            ? "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                            : "text-green-600 hover:text-green-700 hover:bg-green-50"
                        }
                      >
                        {course.isPublished ? <EyeOff className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(course._id, course.title)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete Course"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
