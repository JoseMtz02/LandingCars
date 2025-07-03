import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

/**
 * Hook para sincronizar el estado de autenticación con localStorage
 * y manejar la persistencia de manera robusta
 */
export const useAuthPersistence = () => {
  const { token, user, isAuthenticated, initializeAuth } = useAuthStore();

  // Efecto para sincronizar el estado con localStorage
  useEffect(() => {
    // Verificar si hay cambios en el estado de autenticación
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'titan-auth-storage') {
        // Si el localStorage fue modificado externamente, reinicializar auth
        initializeAuth();
      }
    };

    // Escuchar cambios en localStorage (para múltiples tabs)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [initializeAuth]);

  // Efecto para limpiar localStorage si hay inconsistencias
  useEffect(() => {
    const checkConsistency = () => {
      try {
        const stored = localStorage.getItem('titan-auth-storage');
        if (stored) {
          const parsedData = JSON.parse(stored);
          const storedState = parsedData.state;
          
          // Verificar consistencia
          if (storedState.isAuthenticated !== isAuthenticated ||
              storedState.token !== token) {
            console.warn('Auth state inconsistency detected, reinitializing...');
            initializeAuth();
          }
        }
      } catch (error) {
        console.error('Error checking auth consistency:', error);
      }
    };

    // Verificar consistencia cada vez que cambie el estado
    if (token || user) {
      checkConsistency();
    }
  }, [token, user, isAuthenticated, initializeAuth]);

  return {
    token,
    user,
    isAuthenticated,
    // Método para forzar la limpieza del cache
    clearCache: () => {
      localStorage.removeItem('titan-auth-storage');
      initializeAuth();
    }
  };
};
