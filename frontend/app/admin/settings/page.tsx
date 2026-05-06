"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/Card";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/Badge";
import toast from "react-hot-toast";
import { Settings, Plus, Trash2, Save, Globe, BookOpen, Bell } from "lucide-react";

const DEFAULT_CATEGORIES = [
  "Web Development",
  "Data Science",
  "UI/UX Design",
  "Mobile Development",
  "Cybersecurity",
  "Cloud Computing",
  "Machine Learning",
  "DevOps",
];

export default function AdminSettingsPage() {
  const [platformName, setPlatformName] = useState("EduVerse");
  const [platformTagline, setPlatformTagline] = useState(
    "Learn, grow, and shape the future."
  );
  const [supportEmail, setSupportEmail] = useState("support@eduverse.com");
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [newCategory, setNewCategory] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSaveGeneral = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800)); // Simulate save
    setSaving(false);
    toast.success("Platform settings saved successfully!");
  };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      toast.error("Category already exists");
      return;
    }
    setCategories((prev) => [...prev, trimmed]);
    setNewCategory("");
    toast.success(`Category "${trimmed}" added`);
  };

  const handleRemoveCategory = (cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
    toast.success(`Category "${cat}" removed`);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <Settings className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm">Configure platform-wide settings.</p>
        </div>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-blue-500" />
            General Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Platform Name</label>
            <Input
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              placeholder="e.g. EduVerse"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Platform Tagline</label>
            <Input
              value={platformTagline}
              onChange={(e) => setPlatformTagline(e.target.value)}
              placeholder="A short tagline..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Support Email</label>
            <Input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              placeholder="support@example.com"
            />
          </div>
          <div className="pt-2">
            <Button onClick={handleSaveGeneral} disabled={saving}>
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Category Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-purple-500" />
            Course Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            Add or remove categories used to organize courses on the platform.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="New category name..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            />
            <Button onClick={handleAddCategory} variant="outline" className="gap-1 shrink-0">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((cat) => (
              <div
                key={cat}
                className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 group"
              >
                {cat}
                <button
                  onClick={() => handleRemoveCategory(cat)}
                  className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                  title="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications (Informational only) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-yellow-500" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { label: "New user registrations", desc: "Receive alerts when a new user signs up." },
              { label: "New course submissions", desc: "Alerts for instructor-submitted courses awaiting review." },
              { label: "Payment confirmations", desc: "Alerts for successful payment transactions." },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl border border-red-100 bg-red-50">
            <div>
              <p className="text-sm font-medium text-gray-900">Clear all enrollments</p>
              <p className="text-xs text-gray-500">Permanently remove all enrollment records.</p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => toast.error("This action is disabled in demo mode.")}
            >
              Clear
            </Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl border border-red-100 bg-red-50">
            <div>
              <p className="text-sm font-medium text-gray-900">Reset platform data</p>
              <p className="text-xs text-gray-500">Delete all users, courses, and enrollments.</p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => toast.error("This action is disabled in demo mode.")}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
