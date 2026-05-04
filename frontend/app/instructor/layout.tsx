import ProtectedRoute from "@/src/components/ProtectedRoute";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["instructor", "admin"]}>
      {children}
    </ProtectedRoute>
  );
}
