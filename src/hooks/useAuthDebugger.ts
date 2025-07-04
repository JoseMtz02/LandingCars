import { useEffect } from 'react';

export const useAuthDebugger = () => {
  useEffect(() => {
    const checkStorage = () => {
      const stored = localStorage.getItem('titan-auth-storage');
      console.log('🔍 LocalStorage check:', {
        exists: !!stored,
        content: stored ? JSON.parse(stored) : null,
        timestamp: new Date().toISOString()
      });
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
        console.log('📝 LocalStorage changed:', {
          key: e.key,
          oldValue: e.oldValue ? JSON.parse(e.oldValue) : null,
          newValue: e.newValue ? JSON.parse(e.newValue) : null,
          timestamp: new Date().toISOString()
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
};
