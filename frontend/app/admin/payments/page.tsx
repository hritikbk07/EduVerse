"use client";

import React, { useEffect, useState } from "react";
import { getAdminPayments } from "@/src/lib/axios";
import { Card, CardHeader, CardContent } from "@/src/components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/src/components/ui/Table";
import { Badge } from "@/src/components/ui/Badge";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import toast from "react-hot-toast";
import { Loader2, Search, CreditCard, TrendingUp, DollarSign } from "lucide-react";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await getAdminPayments();
      setPayments(res.data.payments || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filtered = payments.filter(
    (p) =>
      p.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.course?.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

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
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 text-sm mt-1">View all payment transactions across the platform.</p>
        </div>
        <Button onClick={fetchPayments} variant="outline">Refresh</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-green-50 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Transactions</p>
            <p className="text-2xl font-bold text-gray-900">{payments.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Avg. Transaction</p>
            <p className="text-2xl font-bold text-gray-900">
              ${payments.length > 0 ? (totalRevenue / payments.length).toFixed(2) : "0.00"}
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by user or course..."
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
                <TableHead>Course</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                    No payment transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((payment) => (
                  <TableRow key={payment._id?.toString()}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                          {payment.user?.name?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{payment.user?.name || "N/A"}</p>
                          <p className="text-xs text-gray-500">{payment.user?.email || ""}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700 max-w-xs truncate">
                      {payment.course?.title || "Unknown"}
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-green-700">
                        ${Number(payment.amount).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success">Completed</Badge>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {payment.date
                        ? new Date(payment.date).toLocaleDateString("en-US", {
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
