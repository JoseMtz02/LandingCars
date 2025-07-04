import apiClient from '../api/ApiClient';
import type { User } from '../types/auth';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: User;
  message: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  recaptcha: string;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    // No cargar automáticamente desde localStorage aquí
    // Zustand manejará la persistencia
  }

  // Método para configurar el token internamente (usado por Zustand)
  setInternalToken(token: string | null) {
    this.token = token;
    if (token) {
      apiClient.setAuthToken(token);
    } else {
      apiClient.clearAuthToken();
    }
  }

  // Método para limpiar el token internamente (usado por Zustand)
  clearInternalToken() {
    this.token = null;
    apiClient.clearAuthToken();
  }

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>('auth/login', credentials);
      
      // Verificar si el login fue exitoso según el backend Flask
      if (response.data.success && response.data.token && response.data.user) {
        this.token = response.data.token;
        apiClient.setAuthToken(this.token);
        return response.data;
      } else {
        // Si no fue exitoso, lanzar error con el mensaje del backend
        throw new Error(response.data.message || 'Credenciales inválidas');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      
      // Manejar errores HTTP del backend Flask
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as { status: number; data?: string };
        
        if (apiError.status === 401) {
          throw new Error('Credenciales inválidas');
        } else if (apiError.status === 400) {
          // Parsear el mensaje de error del backend si está disponible
          try {
            const errorData = typeof apiError.data === 'string' ? JSON.parse(apiError.data) : apiError.data;
            throw new Error((errorData as { message?: string }).message || 'Datos de login inválidos');
          } catch {
            throw new Error('Datos de login inválidos');
          }
        }
      }
      
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.token) {
        // Llamar al endpoint de logout del backend
        await apiClient.post('auth/logout');
      }
    } catch (error: unknown) {
      console.error('Logout error:', error);
      // No lanzar error en logout, siempre limpiar el token local
    } finally {
      this.token = null;
      apiClient.clearAuthToken();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      if (!this.token) {
        return null;
      }

      const response = await apiClient.get<User>('auth/me');
      return response.data;
    } catch (error: unknown) {
      console.error('Get current user error:', error);
      
      // Manejar errores específicos del backend Flask
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as { status: number };
        
        if (apiError.status === 401) {
          // Token expirado o inválido
          throw new Error('Sesión expirada');
        }
      }
      
      throw error; // No limpiar la sesión aquí, dejar que Zustand lo maneje
    }
  }

  async forgotPassword(identifier: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>('auth/forgot-password', { 
        identifier 
      });
      return response.data;
    } catch (error: unknown) {
      console.error('Forgot password error:', error);
      
      // Manejar errores específicos del backend Flask
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as { status: number; data?: string };
        
        if (apiError.status === 404) {
          throw new Error('Usuario no encontrado');
        } else if (apiError.status === 400) {
          try {
            const errorData = typeof apiError.data === 'string' ? JSON.parse(apiError.data) : apiError.data;
            throw new Error((errorData as { message?: string }).message || 'Datos inválidos');
          } catch {
            throw new Error('Datos inválidos');
          }
        }
      }
      
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>('auth/reset-password', { 
        token, 
        new_password: newPassword  // El backend espera 'new_password'
      });
      return response.data;
    } catch (error: unknown) {
      console.error('Reset password error:', error);
      
      // Manejar errores específicos del backend Flask
      if (error && typeof error === 'object' && 'status' in error) {
        const apiError = error as { status: number; data?: string };
        
        if (apiError.status === 400) {
          try {
            const errorData = typeof apiError.data === 'string' ? JSON.parse(apiError.data) : apiError.data;
            const errorMsg = (errorData as { message?: string }).message;
            
            if (errorMsg?.includes('expired') || errorMsg?.includes('invalid')) {
              throw new Error('El token de recuperación ha expirado o es inválido');
            }
            
            throw new Error(errorMsg || 'Datos inválidos');
          } catch {
            throw new Error('El token de recuperación ha expirado o es inválido');
          }
        }
      }
      
      throw error;
    }
  }

  // Método legacy - mantener para compatibilidad
  getStoredUser(): User | null {
    // Ya no usamos localStorage directamente, Zustand maneja esto
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  // Método legacy - mantener para compatibilidad
  hasValidToken(): boolean {
    return !!this.token;
  }
}

class ContactService {
  async submitContact(formData: ContactFormData): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>('contacts', formData);
      return response.data;
    } catch (error) {
      console.error('Contact form error:', error);
      throw error;
    }
  }

  async getContacts(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>('contacts');
      return response.data;
    } catch (error) {
      console.error('Get contacts error:', error);
      throw error;
    }
  }

  async getMyContacts(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>('contacts/my');
      return response.data;
    } catch (error) {
      console.error('Get my contacts error:', error);
      throw error;
    }
  }

  async getContactById(id: string): Promise<any> {
    try {
      const response = await apiClient.get<any>(`contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get contact by ID error:', error);
      throw error;
    }
  }

  async updateContact(id: string, data: any): Promise<any> {
    try {
      const response = await apiClient.put<any>(`contacts/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Update contact error:', error);
      throw error;
    }
  }

  async deleteContact(id: string): Promise<void> {
    try {
      await apiClient.delete(`contacts/${id}`);
    } catch (error) {
      console.error('Delete contact error:', error);
      throw error;
    }
  }

  async assignContact(id: string, userId: string): Promise<any> {
    try {
      const response = await apiClient.put<any>(`contacts/${id}/assign`, { userId });
      return response.data;
    } catch (error) {
      console.error('Assign contact error:', error);
      throw error;
    }
  }

  async sendFollowUp(id: string, message: string): Promise<any> {
    try {
      const response = await apiClient.post<any>(`contacts/${id}/follow-up`, { message });
      return response.data;
    } catch (error) {
      console.error('Send follow up error:', error);
      throw error;
    }
  }
}

class DashboardService {
  async getStats(): Promise<any> {
    try {
      const response = await apiClient.get<any>('contacts/stats');
      return response.data;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  }
}

class MessagesService {
  async getUnreadCount(): Promise<{ count: number }> {
    try {
      const response = await apiClient.get<{ count: number }>('messages/unread-count');
      return response.data;
    } catch (error) {
      console.error('Get unread count error:', error);
      throw error;
    }
  }

  async getContactMessages(contactId: string): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>(`messages/contact/${contactId}`);
      return response.data;
    } catch (error) {
      console.error('Get contact messages error:', error);
      throw error;
    }
  }

  async createMessage(contactId: string, message: string): Promise<any> {
    try {
      const response = await apiClient.post<any>(`messages/contact/${contactId}`, { message });
      return response.data;
    } catch (error) {
      console.error('Create message error:', error);
      throw error;
    }
  }

  async markAsRead(contactId: string): Promise<void> {
    try {
      await apiClient.post(`messages/contact/${contactId}/mark-read`);
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  }

  async updateMessage(id: string, message: string): Promise<any> {
    try {
      const response = await apiClient.put<any>(`messages/${id}`, { message });
      return response.data;
    } catch (error) {
      console.error('Update message error:', error);
      throw error;
    }
  }

  async deleteMessage(id: string): Promise<void> {
    try {
      await apiClient.delete(`messages/${id}`);
    } catch (error) {
      console.error('Delete message error:', error);
      throw error;
    }
  }
}

class UsersService {
  async createUser(userData: any): Promise<any> {
    try {
      const response = await apiClient.post<any>('auth/users', userData);
      return response.data;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  async getUsers(): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>('auth/users');
      return response.data;
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<any> {
    try {
      const response = await apiClient.get<any>(`auth/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  }

  async updateUser(id: string, userData: any): Promise<any> {
    try {
      const response = await apiClient.put<any>(`auth/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      await apiClient.delete(`auth/users/${id}`);
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }
}

// Instancias de los servicios
export const authService = new AuthService();
export const contactService = new ContactService();
export const dashboardService = new DashboardService();
export const messagesService = new MessagesService();
export const usersService = new UsersService();

export default {
  auth: authService,
  contact: contactService,
  dashboard: dashboardService,
  messages: messagesService,
  users: usersService,
};
