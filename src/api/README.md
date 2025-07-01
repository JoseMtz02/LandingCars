## Configuración

### Variables de entorno (.env)

```env
# URL base de la API
VITE_API_BASE_URL=http://localhost:3000/api

# Timeout en milisegundos (por defecto: 10000)
VITE_API_TIMEOUT=10000

# Número de reintentos (por defecto: 3)
VITE_API_RETRY_ATTEMPTS=3
```

## Uso Básico

### Importar el cliente

```typescript
import apiClient from "./api/GenericRequest";
```

### Métodos disponibles

#### GET - Obtener datos

```typescript
const response = await apiClient.get<User[]>("/users");
console.log(response.data); // Array de usuarios
```

#### POST - Crear datos

```typescript
const newUser = { name: "Juan", email: "juan@example.com" };
const response = await apiClient.post<User>("/users", newUser);
console.log(response.data); // Usuario creado
```

#### PUT - Actualizar datos completos

```typescript
const userData = { name: "Juan Actualizado", email: "juan.nuevo@example.com" };
const response = await apiClient.put<User>("/users/1", userData);
```

#### PATCH - Actualizar datos parciales

```typescript
const partialData = { name: "Solo nombre actualizado" };
const response = await apiClient.patch<User>("/users/1", partialData);
```

#### DELETE - Eliminar datos

```typescript
await apiClient.delete("/users/1");
```

#### HEAD - Obtener solo headers

```typescript
const headers = await apiClient.head("/users/1");
console.log(headers["content-type"]);
```

#### OPTIONS - Métodos permitidos

```typescript
const headers = await apiClient.options("/users");
console.log(headers["allow"]); // GET, POST, PUT, DELETE, etc.
```

### Subida de archivos

```typescript
const file = document.querySelector('input[type="file"]').files[0];
const response = await apiClient.upload<{ url: string }>(
  "/upload",
  file,
  "avatar", // nombre del campo
  { userId: "123" } // datos adicionales
);
```

### Descarga de archivos

```typescript
await apiClient.download("/files/document.pdf", "mi-documento.pdf");
```

## Configuración avanzada

### Autenticación

```typescript
// Configurar token de autenticación
apiClient.setAuthToken("your-jwt-token-here");

// El token se incluirá automáticamente en todos los requests como:
// Authorization: Bearer your-jwt-token-here
```

### Headers personalizados

```typescript
const response = await apiClient.get("/users", {
  headers: {
    "X-Custom-Header": "valor",
    "Accept-Language": "es-ES",
  },
});
```

### Opciones de request

```typescript
const response = await apiClient.post("/users", data, {
  headers: { "Content-Type": "application/json" },
  timeout: 5000, // timeout específico para este request
  retries: 1, // número de reintentos para este request
});
```

### Actualizar configuración global

```typescript
apiClient.updateConfig({
  timeout: 15000,
  retryAttempts: 5,
});
```

### Obtener configuración actual

```typescript
const config = apiClient.getConfig();
console.log(config.baseURL, config.timeout);
```

## Manejo de errores

```typescript
try {
  const response = await apiClient.get("/users");
  // Éxito
} catch (error) {
  // error es de tipo ApiError
  console.error("Error:", error.message);
  console.error("Status:", error.status);
  console.error("Data:", error.data);
}
```

## Tipos TypeScript

```typescript
interface ApiResponse<T> {
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
```

## Ejemplo completo con servicio

```typescript
class UserService {
  private baseEndpoint = "/users";

  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>(this.baseEndpoint);
    return response.data;
  }

  async createUser(userData: CreateUserData): Promise<User> {
    const response = await apiClient.post<User>(this.baseEndpoint, userData);
    return response.data;
  }

  async updateUser(id: number, userData: UpdateUserData): Promise<User> {
    const response = await apiClient.put<User>(
      `${this.baseEndpoint}/${id}`,
      userData
    );
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`${this.baseEndpoint}/${id}`);
  }
}

export const userService = new UserService();
```
