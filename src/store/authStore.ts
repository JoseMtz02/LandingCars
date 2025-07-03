import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/api.service';
import type { User, LoginCredentials } from '../services/api.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  lastAuthCheck: number | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => Promise<void>;
  clearAuthState: () => void;
}

// Tiempo de vida del cache de autenticación (5 minutos)
const AUTH_CACHE_TTL = 5 * 60 * 1000;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      token: null,
      lastAuthCheck: null,

      setUser: (user: User | null) => {
        const token = user ? get().token : null;
        set({ 
          user, 
          isAuthenticated: !!user,
          token,
          lastAuthCheck: user ? Date.now() : null
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      clearAuthState: () => {
        set({
          user: null,
          isAuthenticated: false,
          token: null,
          lastAuthCheck: null,
          isLoading: false
        });
      },

      initializeAuth: async () => {
        set({ isLoading: true });
        try {
          const state = get();
          
          // Si tenemos datos en el store de Zustand, usarlos como fuente de verdad
          if (state.token && state.user) {
            // Verificar si el cache sigue siendo válido
            const cacheValid = state.lastAuthCheck && 
              (Date.now() - state.lastAuthCheck) < AUTH_CACHE_TTL;
            
            if (cacheValid) {
              // Cache válido, usar datos existentes
              authService.setInternalToken(state.token);
              set({ isLoading: false });
              return;
            }
            
            // Cache expirado, verificar con el servidor
            try {
              authService.setInternalToken(state.token);
              const currentUser = await authService.getCurrentUser();
              if (currentUser) {
                set({ 
                  user: currentUser, 
                  isAuthenticated: true,
                  token: state.token,
                  lastAuthCheck: Date.now(),
                  isLoading: false 
                });
                return;
              }
            } catch (tokenError) {
              console.log('Token expired or invalid, cleaning up...', tokenError);
              // Token expirado, limpiar
              await get().logout();
              return;
            }
          }
          
          // No hay datos válidos, limpiar estado
          get().clearAuthState();
          authService.clearInternalToken();
          
        } catch (error) {
          console.error('Error initializing auth:', error);
          get().clearAuthState();
          authService.clearInternalToken();
        }
      },

      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true });
          const response = await authService.login(credentials);
          
          // Zustand manejará la persistencia automáticamente
          set({ 
            user: response.user, 
            isAuthenticated: true,
            token: response.token,
            lastAuthCheck: Date.now(),
            isLoading: false 
          });
          
          // Configurar el token en el servicio
          authService.setInternalToken(response.token);
        } catch (error) {
          set({ isLoading: false });
          console.error('Login failed:', error);
          throw error;
        }
      },

      logout: async () => {
        try {
          const state = get();
          if (state.token) {
            await authService.logout();
          }
        } catch (error) {
          console.error('Logout failed:', error);
        } finally {
          // Limpiar estado
          get().clearAuthState();
          authService.clearInternalToken();
        }
      },

      refreshUser: async () => {
        try {
          const state = get();
          if (!state.token) {
            await get().logout();
            return;
          }
          
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            set({ 
              user: currentUser, 
              isAuthenticated: true,
              token: state.token,
              lastAuthCheck: Date.now()
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
      name: 'titan-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        lastAuthCheck: state.lastAuthCheck
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Error rehydrating auth state:', error);
          return;
        }
        
        if (state) {
          console.log('Auth state rehydrated successfully');
          // Configurar el token en el servicio si existe
          if (state.token) {
            authService.setInternalToken(state.token);
          }
        }
      },
      // Configuraciones adicionales para mejorar la persistencia
      skipHydration: false,
      version: 1, // Versión del schema para futuras migraciones
    }
  )
);
