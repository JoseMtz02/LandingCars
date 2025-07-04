import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
    initializeAuth
  } = useAuthStore();

  // Debug logging
  console.log('🎣 useAuth hook called:', {
    hasUser: !!user,
    isAuthenticated,
    isLoading,
    timestamp: new Date().toISOString()
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
    initializeAuth
  };
};
