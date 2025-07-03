import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

export const SmartRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Redirigir al dashboard si está autenticado
        navigate("/dashboard", { replace: true });
      } else {
        // Permanecer en la página actual si no está autenticado
        // O redirigir a una página específica si es necesario
      }
    }
  }, [isAuthenticated, isLoading, navigate]);

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

  // Esta página nunca debería mostrarse ya que siempre redirige
  return null;
};
