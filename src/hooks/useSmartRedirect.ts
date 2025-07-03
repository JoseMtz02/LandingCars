import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./useAuth";

interface UseSmartRedirectOptions {
  redirectTo?: string;
  redirectWhenAuthenticated?: boolean;
  redirectWhenNotAuthenticated?: boolean;
  fallbackPath?: string;
}

export const useSmartRedirect = (options: UseSmartRedirectOptions = {}) => {
  const {
    redirectTo = "/dashboard",
    redirectWhenAuthenticated = false,
    redirectWhenNotAuthenticated = false,
    fallbackPath = "/",
  } = options;

  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && redirectWhenAuthenticated) {
        navigate(redirectTo, { replace: true });
      } else if (!isAuthenticated && redirectWhenNotAuthenticated) {
        navigate(fallbackPath, { replace: true });
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    navigate,
    redirectTo,
    redirectWhenAuthenticated,
    redirectWhenNotAuthenticated,
    fallbackPath,
  ]);

  return {
    isAuthenticated,
    isLoading,
    shouldRedirect: isLoading
      ? false
      : (isAuthenticated && redirectWhenAuthenticated) ||
        (!isAuthenticated && redirectWhenNotAuthenticated),
  };
};
