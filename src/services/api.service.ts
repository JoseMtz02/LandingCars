import apiClient from '../api/GenericRequest';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  condiciones: boolean;
  recaptcha: string;
}

class AuthService {
  private token: string | null = null;

  constructor() {
    // Cargar token del localStorage al inicializar
    this.token = localStorage.getItem('authToken');
    if (this.token) {
      apiClient.setAuthToken(this.token);
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('auth/login', credentials);
      
      if (response.data && response.data.token) {
        this.token = response.data.token;
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        apiClient.setAuthToken(this.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.token) {
        await apiClient.post('auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.token = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
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
    } catch (error) {
      console.error('Get current user error:', error);
      // Si hay error, limpiar la sesión
      this.logout();
      return null;
    }
  }

  getStoredUser(): User | null {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.getStoredUser();
  }

  getToken(): string | null {
    return this.token;
  }
}

class ContactService {
  async submitContact(formData: ContactFormData): Promise<{ message: string }> {
    try {
      const response = await apiClient.post<{ message: string }>('contact', formData);
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
