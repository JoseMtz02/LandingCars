import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/api.service';
import type { User, LoginCredentials } from '../services/api.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      token: null,

      setUser: (user: User | null) => {
        set({ 
          user, 
          isAuthenticated: !!user,
          token: user ? authService.getToken() : null
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          // Verificar si hay token guardado
          const storedToken = authService.getToken();
          const storedUser = authService.getStoredUser();
          
          if (storedToken && storedUser) {
            // Verificar si el token sigue siendo válido
            try {
              const currentUser = await authService.getCurrentUser();
              if (currentUser) {
                set({ 
                  user: currentUser, 
                  isAuthenticated: true,
                  token: storedToken,
                  isLoading: false 
                });
                return;
              }
            } catch (tokenError) {
              console.log('Token expired or invalid, cleaning up...', tokenError);
              // Token expirado o inválido, limpiar
              await authService.logout();
            }
          }
          
          // Si no hay sesión válida, limpiar todo
          set({ 
            user: null, 
            isAuthenticated: false,
            token: null,
            isLoading: false 
          });
        } catch (error) {
          console.error('Error initializing auth:', error);
          // En caso de error, limpiar todo
          await authService.logout();
          set({ 
            user: null, 
            isAuthenticated: false,
            token: null,
            isLoading: false 
          });
        }
      },

      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true });
          const response = await authService.login(credentials);
          
          set({ 
            user: response.user, 
            isAuthenticated: true,
            token: authService.getToken(),
            isLoading: false 
          });
        } catch (error) {
          set({ isLoading: false });
          console.error('Login failed:', error);
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (error) {
          console.error('Logout failed:', error);
        } finally {
          set({ 
            user: null, 
            isAuthenticated: false,
            token: null,
            isLoading: false 
          });
        }
      },

      refreshUser: async () => {
        try {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            set({ 
              user: currentUser, 
              isAuthenticated: true,
              token: authService.getToken()
            });
          } else {
            await get().logout();
          }
        } catch (error) {
          console.error('Failed to refresh user:', error);
          await get().logout();
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Después de rehydratar, verificar si tenemos datos válidos
          const hasValidData = state.user && state.token && state.isAuthenticated;
          if (hasValidData) {
            // El token se configurará en initializeAuth
            console.log('Auth data rehydrated successfully');
          }
        }
      },
    }
  )
);
