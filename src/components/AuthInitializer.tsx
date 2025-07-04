import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer: React.FC<AuthInitializerProps> = ({
  children,
}) => {
  const { initializeAuth, isLoading, isAuthenticated, user, token } =
    useAuthStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Solo inicializar si no se ha hecho antes Y no hay datos de autenticación válidos
    if (!hasInitialized.current) {
      // Verificar si ya tenemos datos válidos antes de inicializar
      if (isAuthenticated && user && token) {
        console.log(
          "� AuthInitializer: User already authenticated, skipping initialization"
        );
        hasInitialized.current = true;
        return;
      }

      hasInitialized.current = true;
      console.log("� AuthInitializer: Starting initialization...");
      initializeAuth();
    }
  }, [initializeAuth, isAuthenticated, user, token]);

  // Si está cargando, mostrar la pantalla de carga
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white text-lg">Iniciando aplicación...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
