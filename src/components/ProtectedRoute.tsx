import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
// import { useAuthRedirect } from "../hooks/useAuthRedirect"; // COMENTADO TEMPORALMENTE

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

  // Hook de redirección inteligente - COMENTADO TEMPORALMENTE PARA DEBUG
  // useAuthRedirect();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/auth/login", { replace: true });
        return;
      }

      if (requireAdmin && user?.role !== "admin") {
        navigate("/dashboard", { replace: true });
        return;
      }
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
