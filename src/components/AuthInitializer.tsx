import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";

interface AuthInitializerProps {
  children: React.ReactNode;
}

export const AuthInitializer: React.FC<AuthInitializerProps> = ({
  children,
}) => {
  const {
    initializeAuth,
    isLoading,
    isAuthenticated,
    user,
    token,
    setLoading,
  } = useAuthStore();
  const hasInitialized = useRef(false);

  // Efecto para manejar el estado hidratado inmediatamente
  useEffect(() => {
    // Si tenemos datos válidos y aún está cargando, cambiar isLoading a false inmediatamente
    if (
      isAuthenticated &&
      user &&
      token &&
      isLoading &&
      !hasInitialized.current
    ) {
      console.log(
        "⚡ AuthInitializer: Quick load - found valid auth data, stopping loading"
      );
      setLoading(false);
      hasInitialized.current = true;
    }
  }, [isAuthenticated, user, token, isLoading, setLoading]);

  useEffect(() => {
    // Solo inicializar si no se ha hecho antes
    if (!hasInitialized.current) {
      hasInitialized.current = true;

      // Verificar si ya tenemos datos válidos antes de inicializar
      if (isAuthenticated && user && token) {
        console.log(
          "🔒 AuthInitializer: User already authenticated, skipping initialization"
        );
        setLoading(false); // Asegurar que isLoading se ponga en false
        return;
      }

      console.log("🚀 AuthInitializer: Starting initialization...");
      initializeAuth();
    }
  }, [initializeAuth, isAuthenticated, user, token, setLoading]);

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
