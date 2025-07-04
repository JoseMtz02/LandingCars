import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';

/**
 * Hook para sincronizar el estado de autenticación con localStorage
 * y manejar la persistencia de manera robusta (optimizado para evitar loops)
 */
export const useAuthPersistence = () => {
  const { token, user, isAuthenticated, initializeAuth } = useAuthStore();
  const hasInitialized = useRef(false);

  // Efecto para sincronizar el estado con localStorage (solo cambios externos)
  useEffect(() => {
    // Verificar si hay cambios en el estado de autenticación desde otras tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'titan-auth-storage' && e.oldValue !== e.newValue) {
        console.log('External storage change detected, reinitializing auth...');
        // Solo reinicializar si hay un cambio real desde otra tab
        initializeAuth();
      }
    };

    // Escuchar cambios en localStorage (para múltiples tabs)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [initializeAuth]);

  // Efecto de inicialización único
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      // Solo inicializar una vez al montar el hook
      initializeAuth();
    }
  }, [initializeAuth]);

  return {
    token,
    user,
    isAuthenticated,
    // Método para forzar la limpieza del cache
    clearCache: () => {
      localStorage.removeItem('titan-auth-storage');
      hasInitialized.current = false;
      initializeAuth();
    }
  };
};
