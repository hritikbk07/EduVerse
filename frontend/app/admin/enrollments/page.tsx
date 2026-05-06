"use client";

import React, { useEffect, useState } from "react";
import { getAdminEnrollments } from "@/src/lib/axios";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/src/components/ui/Table";
import { Badge } from "@/src/components/ui/Badge";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import toast from "react-hot-toast";
import { Loader2, Search, GraduationCap } from "lucide-react";

export default function AdminEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const res = await getAdminEnrollments();
      setEnrollments(res.data.enrollments || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch enrollments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const filtered = enrollments.filter(
    (e) =>
      e.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.course?.title?.toLowerCase().includes(search.toLowerCase()) ||
      e.user?.email?.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="text-2xl font-bold text-gray-900">Enrollments</h1>
          <p className="text-gray-500 text-sm mt-1">
            View all student enrollments across the platform.
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-sm text-gray-500 font-medium">
            {enrollments.length} total
          </span>
          <Button onClick={fetchEnrollments} variant="outline">Refresh</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by student or course..."
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
                <TableHead>Student</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Enrolled On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    No enrollments found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((enrollment) => (
                  <TableRow key={enrollment._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                          {enrollment.user?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <span className="font-medium text-gray-900">
                          {enrollment.user?.name || "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {enrollment.user?.email || "N/A"}
                    </TableCell>
                    <TableCell className="font-medium text-gray-800 max-w-xs truncate">
                      {enrollment.course?.title || "Unknown Course"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden max-w-[80px]">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${enrollment.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{enrollment.progress || 0}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {enrollment.createdAt
                        ? new Date(enrollment.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
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
