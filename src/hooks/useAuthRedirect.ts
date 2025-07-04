import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "./useAuth";

interface UseAuthRedirectOptions {
  redirectTo?: string;
  fallbackPath?: string;
}

export const useAuthRedirect = (options: UseAuthRedirectOptions = {}) => {
  const { redirectTo = "/dashboard", fallbackPath = "/auth/login" } = options;
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Solo proceder si no está cargando y no hemos redirigido aún
    if (!isLoading && !hasRedirected.current) {
      if (isAuthenticated) {
        // Si el usuario está autenticado y está en una página de auth, redirigir al dashboard
        if (location.pathname.startsWith("/auth") || location.pathname === "/login") {
          // Comprobar si hay una URL de retorno guardada
          const intendedPath = sessionStorage.getItem("intendedPath");
          const targetPath = intendedPath || redirectTo;
          
          // Limpiar la URL de retorno guardada
          sessionStorage.removeItem("intendedPath");
          
          hasRedirected.current = true;
          navigate(targetPath, { replace: true });
        }
      } else {
        // Si el usuario no está autenticado y está en una ruta protegida
        const protectedPaths = ["/dashboard"];
        const isProtectedPath = protectedPaths.some(path => location.pathname.startsWith(path));
        
        if (isProtectedPath) {
          // Guardar la ruta donde el usuario intentaba ir
          sessionStorage.setItem("intendedPath", location.pathname);
          hasRedirected.current = true;
          navigate(fallbackPath, { replace: true });
        }
      }
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname, redirectTo, fallbackPath]);

  // Reset the redirect flag when the path changes significantly
  useEffect(() => {
    hasRedirected.current = false;
  }, [location.pathname]);

  return {
    isAuthenticated,
    isLoading,
    currentPath: location.pathname,
  };
};
