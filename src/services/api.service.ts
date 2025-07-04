import apiClient from '../api/ApiClient';
import type { 
  Contact, 
  ContactResponse, 
  ContactSingleResponse, 
  ContactQueryParams, 
  DashboardStats,
  ContactUpdateData,
  User,
  Message,
  UserCreateData,
  UserUpdateData
} from '../types/contacts';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token?: string;
    user?: User;
  }
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
      
      if (response.data.success && response.data.data.token && response.data.data.user) {
        this.token = response.data.data.token;
        apiClient.setAuthToken(this.token);
        return response.data;
      } else {
        throw new Error(response.data.message || 'Credenciales inválidas');
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      
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
  async submitContact(formData: ContactFormData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>('contact', formData);
      return response.data;
    } catch (error) {
      console.error('Contact form error:', error);
      throw error;
    }
  }

  async getContacts(params?: ContactQueryParams): Promise<ContactResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      const url = queryParams.toString() ? `contacts?${queryParams.toString()}` : 'contacts';
      const response = await apiClient.get<ContactResponse>(url);
      return response.data;
    } catch (error) {
      console.error('Get contacts error:', error);
      throw error;
    }
  }

  async getMyContacts(params?: ContactQueryParams): Promise<ContactResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }
      
      const url = queryParams.toString() ? `contacts/my?${queryParams.toString()}` : 'contacts/my';
      const response = await apiClient.get<ContactResponse>(url);
      return response.data;
    } catch (error) {
      console.error('Get my contacts error:', error);
      throw error;
    }
  }

  async getContactById(id: number): Promise<Contact> {
    try {
      const response = await apiClient.get<ContactSingleResponse>(`contacts/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Get contact by ID error:', error);
      throw error;
    }
  }

  async updateContact(id: number, data: ContactUpdateData): Promise<Contact> {
    try {
      const response = await apiClient.put<ContactSingleResponse>(`contacts/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Update contact error:', error);
      throw error;
    }
  }

  async deleteContact(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete<{ success: boolean; message: string }>(`contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete contact error:', error);
      throw error;
    }
  }

  async assignContact(contactId: number, userId: number): Promise<Contact> {
    try {
      const response = await apiClient.put<ContactSingleResponse>(`contacts/${contactId}/assign`, { 
        assigned_to: userId 
      });
      return response.data.data;
    } catch (error) {
      console.error('Assign contact error:', error);
      throw error;
    }
  }

  async sendFollowUpEmail(contactId: number, customMessage?: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>(`contacts/${contactId}/follow-up`, { 
        customMessage 
      });
      return response.data;
    } catch (error) {
      console.error('Send follow up email error:', error);
      throw error;
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<{ success: boolean; data: DashboardStats }>('contacts/stats');
      return response.data.data;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: User[] }>('auth/users');
      return response.data.data;
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }
}

class DashboardService {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<{ success: boolean; data: DashboardStats }>('contacts/stats');
      return response.data.data;
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

  async getContactMessages(contactId: number): Promise<Message[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: Message[] }>(`messages/contact/${contactId}`);
      return response.data.data;
    } catch (error) {
      console.error('Get contact messages error:', error);
      throw error;
    }
  }

  async createMessage(contactId: number, message: string): Promise<Message> {
    try {
      const response = await apiClient.post<{ success: boolean; data: Message }>(`messages/contact/${contactId}`, { message });
      return response.data.data;
    } catch (error) {
      console.error('Create message error:', error);
      throw error;
    }
  }

  async markAsRead(contactId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.post<{ success: boolean; message: string }>(`messages/contact/${contactId}/mark-read`);
      return response.data;
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  }

  async updateMessage(id: number, message: string): Promise<Message> {
    try {
      const response = await apiClient.put<{ success: boolean; data: Message }>(`messages/${id}`, { message });
      return response.data.data;
    } catch (error) {
      console.error('Update message error:', error);
      throw error;
    }
  }

  async deleteMessage(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete<{ success: boolean; message: string }>(`messages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete message error:', error);
      throw error;
    }
  }
}

class UsersService {
  async createUser(userData: UserCreateData): Promise<User> {
    try {
      const response = await apiClient.post<{ success: boolean; data: User }>('auth/users', userData);
      return response.data.data;
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<{ success: boolean; data: User[] }>('auth/users');
      return response.data.data;
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const response = await apiClient.get<{ success: boolean; data: User }>(`auth/users/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Get user by ID error:', error);
      throw error;
    }
  }

  async updateUser(id: number, userData: UserUpdateData): Promise<User> {
    try {
      const response = await apiClient.put<{ success: boolean; data: User }>(`auth/users/${id}`, userData);
      return response.data.data;
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete<{ success: boolean; message: string }>(`auth/users/${id}`);
      return response.data;
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
