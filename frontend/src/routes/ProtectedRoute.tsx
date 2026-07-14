import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

// ==============================
// Props
// ==============================

interface ProtectedRouteProps {
  children: ReactNode;
}

// ==============================
// Component
// ==============================

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  );

  // Show simple loading component while authentication is initializing
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-gray-400 animate-pulse font-medium">
            Initializing ChatSphere...
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return children;
}