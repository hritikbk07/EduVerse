"use client";

import { useState } from "react";
import API from "@/src/lib/axios";
import { User, Mail, Lock, UserPlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Input } from "@/src/components/ui/Input";

export default function CreateInstructorPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/api/admin/create-instructor", form);
      toast.success(res.data.message || "Instructor created successfully!");
      setForm({ name: "", email: "", password: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create instructor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Instructor</h1>
        <p className="text-gray-500 text-sm mt-1">
          Provision a new instructor account with immediate platform access.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <UserPlus className="h-4 w-4 text-blue-500" />
            Instructor Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-gray-400" />
                Full Name
              </label>
              <Input
                type="text"
                name="name"
                placeholder="e.g. Dr. Ada Lovelace"
                required
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-gray-400" />
                Work Email
              </label>
              <Input
                type="email"
                name="email"
                placeholder="instructor@eduverse.com"
                required
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-gray-400" />
                Temporary Password
              </label>
              <Input
                type="password"
                name="password"
                placeholder="Min. 8 characters"
                required
                minLength={8}
                value={form.password}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-400">
                The instructor should change this on first login.
              </p>
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Create Instructor Account
                  </span>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-blue-800 mb-1">What happens next?</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>The instructor receives their credentials to log in.</li>
          <li>They can immediately create and publish courses.</li>
          <li>You can manage their access from the Users page.</li>
        </ul>
      </div>
    </div>
  );
}