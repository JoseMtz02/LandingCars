import { mockApiService } from './mockApiService';

// Configuración para usar mock API en desarrollo
const USE_MOCK_API = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API !== 'false';

interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  data?: unknown;
}

class ApiClient {
  private authToken?: string;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  clearAuthToken(): void {
    this.authToken = undefined;
  }

  private async handleMockRequest<T>(
    method: string,
    endpoint: string,
    data?: unknown
  ): Promise<ApiResponse<T>> {
    console.log(`[MOCK API] ${method} ${endpoint}`, data);

    // Simular autenticación
    if (endpoint === 'auth/login' && method === 'POST') {
      return mockApiService.login(data as { username: string; password: string }) as Promise<ApiResponse<T>>;
    }

    if (endpoint === 'auth/me' && method === 'GET') {
      if (!this.authToken) {
        throw new Error('No hay token de autenticación');
      }
      return mockApiService.getCurrentUser(this.authToken) as Promise<ApiResponse<T>>;
    }

    if (endpoint === 'auth/logout' && method === 'POST') {
      return mockApiService.logout() as Promise<ApiResponse<T>>;
    }

    // Para otros endpoints, retornar datos mock básicos
    return {
      data: {} as T,
      status: 200,
      statusText: 'OK',
      headers: {}
    };
  }

  private async makeRequest<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Usar mock API en desarrollo
    if (USE_MOCK_API) {
      return this.handleMockRequest<T>(method, endpoint, data);
    }

    const url = `${this.baseURL}/${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Agregar headers personalizados si existen
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw {
          message: `HTTP Error: ${response.status}`,
          status: response.status,
          statusText: response.statusText,
          data: errorText,
        };
      }

      const responseData = await response.json();
      
      return {
        data: responseData,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error('API Error:', apiError);
      throw apiError;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('GET', endpoint, undefined, options);
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('POST', endpoint, data, options);
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('PUT', endpoint, data, options);
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.makeRequest<T>('DELETE', endpoint, undefined, options);
  }
}

// Crear instancia singleton
const apiClient = new ApiClient();

// Habilitar mock API por defecto en desarrollo
if (USE_MOCK_API) {
  console.log('🔧 Usando Mock API para desarrollo');
}

export default apiClient;
