import ProtectedRoute from "@/src/components/ProtectedRoute";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["student", "admin", "instructor"]}>
      {children}
    </ProtectedRoute>
  );
}
