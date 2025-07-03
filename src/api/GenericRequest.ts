// Tipos para las opciones de configuración
interface ApiConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
}

interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

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

class GenericRequest {
  private config: ApiConfig;
  private authToken?: string;

  constructor() {
    this.config = {
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
      timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000,
      retryAttempts: parseInt(import.meta.env.VITE_API_RETRY_ATTEMPTS) || 3,
    };
  }

  private buildUrl(endpoint: string): string {
    const baseUrl = this.config.baseURL.endsWith('/') 
      ? this.config.baseURL.slice(0, -1) 
      : this.config.baseURL;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  }

  private handleError(error: unknown): never {
    const errorObj = error as Record<string, unknown>;
    const apiError: ApiError = {
      message: (typeof errorObj?.message === 'string' ? errorObj.message : 'Error desconocido'),
      status: (typeof errorObj?.status === 'number' ? errorObj.status : undefined),
      statusText: (typeof errorObj?.statusText === 'string' ? errorObj.statusText : undefined),
      data: errorObj?.data,
    };
    throw apiError;
  }

  private async executeRequest<T>(
    url: string,
    options: RequestInit,
    retries: number = this.config.retryAttempts
  ): Promise<ApiResponse<T>> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw {
          message: `HTTP Error: ${response.status}`,
          status: response.status,
          statusText: response.statusText,
          data: await response.text(),
        };
      }

      const data = await response.json();
      
      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      };
    } catch (error: unknown) {
      if (retries > 0 && (error as Error).name !== 'AbortError') {
        console.warn(`Reintentando request. Intentos restantes: ${retries - 1}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.executeRequest<T>(url, options, retries - 1);
      }
      this.handleError(error);
    }
  }

  private prepareHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders,
    };

    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  async get<T = unknown>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const headers = this.prepareHeaders(options?.headers);

    return this.executeRequest<T>(url, {
      method: 'GET',
      headers,
    }, options?.retries);
  }

  async post<T = unknown>(
    endpoint: string, 
    data?: unknown, 
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const headers = this.prepareHeaders(options?.headers);

    return this.executeRequest<T>(url, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    }, options?.retries);
  }

  async put<T = unknown>(
    endpoint: string, 
    data?: unknown, 
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const headers = this.prepareHeaders(options?.headers);

    return this.executeRequest<T>(url, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    }, options?.retries);
  }

  async patch<T = unknown>(
    endpoint: string, 
    data?: unknown, 
    options?: RequestOptions
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const headers = this.prepareHeaders(options?.headers);

    return this.executeRequest<T>(url, {
      method: 'PATCH',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    }, options?.retries);
  }

  async delete<T = unknown>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const headers = this.prepareHeaders(options?.headers);

    return this.executeRequest<T>(url, {
      method: 'DELETE',
      headers,
    }, options?.retries);
  }

  async head(endpoint: string, options?: RequestOptions): Promise<Record<string, string>> {
    const url = this.buildUrl(endpoint);
    const headers = this.prepareHeaders(options?.headers);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        method: 'HEAD',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw {
          message: `HTTP Error: ${response.status}`,
          status: response.status,
          statusText: response.statusText,
        };
      }

      return Object.fromEntries(response.headers.entries());
    } catch (error) {
      this.handleError(error);
    }
  }

  async options(endpoint: string, options?: RequestOptions): Promise<Record<string, string>> {
    const url = this.buildUrl(endpoint);
    const headers = this.prepareHeaders(options?.headers);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        method: 'OPTIONS',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw {
          message: `HTTP Error: ${response.status}`,
          status: response.status,
          statusText: response.statusText,
        };
      }

      return Object.fromEntries(response.headers.entries());
    } catch (error) {
      this.handleError(error);
    }
  }

  async upload<T = unknown>(
    endpoint: string,
    file: File,
    fieldName: string = 'file',
    additionalData?: Record<string, string>,
    options?: Omit<RequestOptions, 'headers'>
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const formData = new FormData();
    
    formData.append(fieldName, file);
    
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const headers: Record<string, string> = {};

    return this.executeRequest<T>(url, {
      method: 'POST',
      headers,
      body: formData,
    }, options?.retries);
  }

  async download(
    endpoint: string,
    filename?: string,
    options?: RequestOptions
  ): Promise<void> {
    const url = this.buildUrl(endpoint);
    const headers = this.prepareHeaders(options?.headers);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw {
          message: `HTTP Error: ${response.status}`,
          status: response.status,
          statusText: response.statusText,
        };
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      this.handleError(error);
    }
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  clearAuthToken(): void {
    this.authToken = undefined;
  }

  getConfig(): ApiConfig {
    return { ...this.config };
  }

  updateConfig(newConfig: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

const apiClient = new GenericRequest();

export default apiClient;
export { GenericRequest, type ApiResponse, type ApiError, type RequestOptions };