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
  lastLoginTime: number | null; // Nueva propiedad para rastrear logins recientes
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

// Variable para prevenir inicializaciones concurrentes
let isInitializing = false;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      token: null,
      lastAuthCheck: null,
      lastLoginTime: null,

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
          lastLoginTime: null,
          isLoading: false
        });
      },

      initializeAuth: async () => {
        // Prevenir inicializaciones concurrentes
        if (isInitializing) {
          console.log('🔄 InitializeAuth already in progress, skipping...');
          return;
        }
        
        isInitializing = true;
        console.log('🔄 InitializeAuth started');
        set({ isLoading: true });
        
        try {
          const state = get();
          console.log('📊 Current state:', {
            hasUser: !!state.user,
            hasToken: !!state.token,
            isAuthenticated: state.isAuthenticated,
            lastAuthCheck: state.lastAuthCheck ? new Date(state.lastAuthCheck).toISOString() : null,
            lastLoginTime: state.lastLoginTime ? new Date(state.lastLoginTime).toISOString() : null
          });
          
          // Si tenemos datos en el store de Zustand, usarlos como fuente de verdad
          if (state.token && state.user) {
            // Verificar si el cache sigue siendo válido (incluyendo logins recientes)
            const cacheValid = state.lastAuthCheck && 
              (Date.now() - state.lastAuthCheck) < AUTH_CACHE_TTL;
            
            // Verificar si es un login muy reciente (menos de 60 segundos)
            const isRecentLogin = state.lastLoginTime && 
              (Date.now() - state.lastLoginTime) < 60000; // 60 segundos
            
            console.log('💰 Cache check:', {
              cacheValid,
              isRecentLogin,
              timeSinceLastCheck: state.lastAuthCheck ? Date.now() - state.lastAuthCheck : null,
              timeSinceLogin: state.lastLoginTime ? Date.now() - state.lastLoginTime : null,
              cacheTTL: AUTH_CACHE_TTL
            });
            
            if (cacheValid || isRecentLogin) {
              // Cache válido o login reciente, usar datos existentes sin verificación
              console.log('✅ Using cached auth data (valid cache or recent login)');
              authService.setInternalToken(state.token);
              set({ isLoading: false });
              return;
            }
            
            // Cache expirado, verificar con el servidor solo si es necesario
            console.log('🔍 Cache expired, verifying with server...');
            try {
              authService.setInternalToken(state.token);
              const currentUser = await authService.getCurrentUser();
              if (currentUser) {
                console.log('✅ User verified successfully');
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
                console.log('⚠️ User not found but token valid, keeping cached data');
                set({ 
                  isLoading: false,
                  lastAuthCheck: Date.now() // Actualizar el check para evitar verificaciones constantes
                });
                return;
              }
            } catch (tokenError) {
              console.log('❌ Token verification failed:', tokenError);
              // Solo limpiar si es realmente un error de autenticación (401, 403)
              if (tokenError && typeof tokenError === 'object' && 'status' in tokenError) {
                const apiError = tokenError as { status: number };
                if (apiError.status === 401 || apiError.status === 403) {
                  // Token realmente expirado o inválido
                  console.log('🧹 Token expired/invalid, clearing auth state');
                  get().clearAuthState();
                  authService.clearInternalToken();
                  set({ isLoading: false });
                  return;
                }
              }
              // Para otros errores (red, servidor, etc), mantener el estado actual
              console.log('🌐 Network/server error, keeping current auth state');
              set({ isLoading: false });
              return;
            }
          }
          
          // No hay datos válidos, limpiar estado
          console.log('🧹 No valid data found, clearing state');
          get().clearAuthState();
          authService.clearInternalToken();
          set({ isLoading: false });
        } catch (error) {
          console.error('💥 Error initializing auth:', error);
          get().clearAuthState();
          authService.clearInternalToken();
          set({ isLoading: false });
        } finally {
          isInitializing = false;
        }
      },

      login: async (credentials: LoginCredentials) => {
        try {
          console.log('🔑 Login attempt started');
          set({ isLoading: true });
          const response = await authService.login(credentials);
          
          if (response.success && response.data.user && response.data.token) {
            console.log('✅ Login successful, setting auth state');
            
            // Primero configurar el token en el servicio
            authService.setInternalToken(response.data.token);
            
            const now = Date.now();
            
            // Luego actualizar el estado de Zustand
            set({ 
              user: response.data.user, 
              isAuthenticated: true,
              token: response.data.token,
              lastAuthCheck: now,
              lastLoginTime: now, // Marcar el tiempo de login
              isLoading: false 
            });
            
            console.log('📊 Auth state after login:', {
              hasUser: !!response.data.user,
              hasToken: !!response.data.token,
              isAuthenticated: true,
              loginTime: new Date(now).toISOString()
            });
            
          } else {
            console.log('❌ Login failed: Invalid response');
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
            console.log('User not found during refresh, keeping token');
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
          console.log('Non-auth error during refresh, keeping current state');
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
        lastAuthCheck: state.lastAuthCheck,
        lastLoginTime: state.lastLoginTime
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Error rehydrating auth state:', error);
          return;
        }
        
        if (state) {
          console.log('Auth state rehydrated successfully:', {
            hasUser: !!state.user,
            hasToken: !!state.token,
            isAuthenticated: state.isAuthenticated
          });
          // Configurar el token en el servicio si existe
          if (state.token) {
            authService.setInternalToken(state.token);
          }
        } else {
          console.log('No auth state to rehydrate');
        }
      },
      // Configuraciones adicionales para mejorar la persistencia
      skipHydration: false,
      version: 2, // Versión del schema para futuras migraciones (incrementada por lastLoginTime)
    }
  )
);
