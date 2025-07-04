import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Hook de redirección inteligente
  useAuthRedirect();

  // Debug logging
  console.log("🛡️ ProtectedRoute check:", {
    isLoading,
    isAuthenticated,
    hasUser: !!user,
    userRole: user?.role,
    requireAdmin,
  });

  useEffect(() => {
    if (!isLoading) {
      console.log("🛡️ ProtectedRoute effect triggered:", {
        isAuthenticated,
        hasUser: !!user,
        userRole: user?.role,
      });

      if (!isAuthenticated) {
        console.log("❌ Not authenticated, redirecting to login");
        navigate("/auth/login", { replace: true });
        return;
      }

      if (requireAdmin && user?.role !== "admin") {
        console.log(
          "❌ Admin required but user is not admin, redirecting to dashboard"
        );
        navigate("/dashboard", { replace: true });
        return;
      }

      console.log("✅ Access granted");
    }
  }, [isAuthenticated, isLoading, user, navigate, requireAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white text-lg">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requireAdmin && user?.role !== "admin") {
    return null;
  }

  return <>{children}</>;
}
