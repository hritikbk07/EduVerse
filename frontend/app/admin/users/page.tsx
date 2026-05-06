"use client";

import React, { useEffect, useState } from "react";
import { getAllUsers, deleteUser, blockUser, updateUserRole } from "@/src/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/Card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/src/components/ui/Table";
import { Badge } from "@/src/components/ui/Badge";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";
import toast from "react-hot-toast";
import { Loader2, Search, MoreVertical, ShieldAlert, Trash2, Ban } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data.users || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(id);
      toast.success("User deleted successfully");
      setUsers(users.filter((u) => u._id !== id));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const handleBlock = async (id: string, currentlyBlocked: boolean) => {
    try {
      await blockUser(id);
      toast.success(`User ${currentlyBlocked ? 'unblocked' : 'blocked'} successfully`);
      setUsers(users.map(u => u._id === id ? { ...u, isBlocked: !u.isBlocked } : u));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to toggle block status");
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await updateUserRole(id, newRole);
      toast.success(`User role updated to ${newRole}`);
      setUsers(users.map(u => u._id === id ? { ...u, role: newRole } : u));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500 text-sm mt-1">Manage platform users, roles, and access.</p>
        </div>
        <Button onClick={fetchUsers} variant="outline">Refresh</Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="instructor">Instructors</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No users found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium text-gray-900">{user.name}</TableCell>
                    <TableCell className="text-gray-500">{user.email}</TableCell>
                    <TableCell>
                      <select
                        className="text-sm bg-transparent border-b border-dashed border-gray-300 focus:outline-none cursor-pointer pb-0.5"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      >
                        <option value="student">Student</option>
                        <option value="instructor">Instructor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      {user.isBlocked ? (
                        <Badge variant="danger">Blocked</Badge>
                      ) : (
                        <Badge variant="success">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBlock(user._id, user.isBlocked)}
                        title={user.isBlocked ? "Unblock User" : "Block User"}
                        className={user.isBlocked ? "text-green-600 hover:text-green-700" : "text-yellow-600 hover:text-yellow-700"}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user._id)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete User"
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
