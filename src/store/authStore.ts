import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/api.service';
import type { User, LoginCredentials } from '../types/auth';

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

// Tiempo de vida del cache de autenticación (30 minutos)
const AUTH_CACHE_TTL = 30 * 60 * 1000;

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
            
            // Cache expirado, pero primero intentar usar los datos existentes
            authService.setInternalToken(state.token);
            set({ 
              isLoading: false,
              lastAuthCheck: Date.now() // Actualizar timestamp pero mantener datos
            });
            return;
            
            /* Comentado temporalmente para debug - verificación del servidor
            // Cache expirado, verificar con el servidor solo si es necesario
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
              } else {
                // Usuario no encontrado pero token técnicamente válido - mantener datos del cache
                set({ 
                  isLoading: false,
                  lastAuthCheck: Date.now() // Actualizar el check para evitar verificaciones constantes
                });
                return;
              }
            } catch (tokenError) {
              // Solo limpiar si es realmente un error de autenticación (401, 403)
              if (tokenError && typeof tokenError === 'object' && 'status' in tokenError) {
                const apiError = tokenError as { status: number };
                if (apiError.status === 401 || apiError.status === 403) {
                  // Token realmente expirado o inválido
                  get().clearAuthState();
                  authService.clearInternalToken();
                  set({ isLoading: false });
                  return;
                }
              }
              // Para otros errores (red, servidor, etc), mantener el estado actual
              set({ isLoading: false });
              return;
            }
            */
          }
          
          // No hay datos válidos, limpiar estado SOLO si realmente no hay nada
          if (!state.token && !state.user && !state.isAuthenticated) {
            get().clearAuthState();
            authService.clearInternalToken();
          } else {
            // Datos encontrados pero no procesados correctamente
          }
          set({ isLoading: false });
        } catch (error) {
          console.error('💥 Error initializing auth:', error);
          get().clearAuthState();
          authService.clearInternalToken();
          set({ isLoading: false });
        }
      },

      login: async (credentials: LoginCredentials) => {
        try {
          set({ isLoading: true });
          const response = await authService.login(credentials);
          
          if (response.success && response.data.user && response.data.token) {
            
            // Primero configurar el token en el servicio
            authService.setInternalToken(response.data.token);
            
            // Luego actualizar el estado de Zustand
            set({ 
              user: response.data.user, 
              isAuthenticated: true,
              token: response.data.token,
              lastAuthCheck: Date.now(),
              isLoading: false 
            });
            
            
          } else {
            set({ isLoading: false });
            throw new Error(response.message || 'Error en el login');
          }
        } catch (error) {
          console.error('💥 Login failed:', error);
          set({ isLoading: false });
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
            // No hay token, limpiar estado
            get().clearAuthState();
            authService.clearInternalToken();
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
            // Usuario no encontrado, pero mantener token por si es un error temporal
            set({ lastAuthCheck: Date.now() });
          }
        } catch (error) {
          console.error('Failed to refresh user:', error);
          // Solo limpiar en errores de autenticación específicos
          if (error && typeof error === 'object' && 'status' in error) {
            const apiError = error as { status: number };
            if (apiError.status === 401 || apiError.status === 403) {
              await get().logout();
              return;
            }
          }
          // Para otros errores, mantener el estado actual
        }
      },
    }),
    {
      name: 'titan-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        return { 
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
          lastAuthCheck: state.lastAuthCheck
        };
      },
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('❌ Error rehydrating auth state:', error);
          return;
        }
        
        if (state) {
          // Configurar el token en el servicio si existe
          if (state.token) {
            authService.setInternalToken(state.token);
          }
        } else {
          // No hay estado de autenticación para rehidratar
        }
      },
      // Configuraciones adicionales para mejorar la persistencia
      skipHydration: false,
      version: 1, // Versión del schema para futuras migraciones
    }
  )
);
