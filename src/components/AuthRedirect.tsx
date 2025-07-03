import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

interface AuthRedirectProps {
  children: React.ReactNode;
  redirectTo?: string;
  redirectWhenAuthenticated?: boolean;
}

export const AuthRedirect: React.FC<AuthRedirectProps> = ({
  children,
  redirectTo = "/dashboard",
  redirectWhenAuthenticated = true,
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && redirectWhenAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [
    isAuthenticated,
    isLoading,
    navigate,
    redirectTo,
    redirectWhenAuthenticated,
  ]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white text-lg">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  // Si está autenticado y debe redirigir, no mostrar el contenido
  if (isAuthenticated && redirectWhenAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
