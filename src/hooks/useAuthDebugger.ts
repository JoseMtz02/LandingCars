import { useEffect } from 'react';

export const useAuthDebugger = () => {
  useEffect(() => {
    const checkStorage = () => {
      // Verificación silenciosa del storage
      localStorage.getItem('titan-auth-storage');
    };

    // Verificar cada 2 segundos
    const interval = setInterval(checkStorage, 2000);
    
    // Verificar inmediatamente
    checkStorage();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Listener para cambios en localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'titan-auth-storage') {
        // Cambio detectado en localStorage
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
};
