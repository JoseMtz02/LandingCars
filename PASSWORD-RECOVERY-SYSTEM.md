# Funcionalidad de Recuperación de Contraseña

## Descripción

Se ha implementado un sistema completo de recuperación de contraseña que permite a los usuarios restablecer su contraseña a través de correo electrónico.

## Funcionalidades Implementadas

### 1. Solicitud de Recuperación de Contraseña

- **Ruta**: `/auth/forgot-password`
- **Componente**: `ForgotPasswordView`
- **Funcionalidad**: Permite al usuario ingresar su correo electrónico para recibir un enlace de recuperación

### 2. Restablecimiento de Contraseña

- **Ruta**: `/auth/reset-password?token=<token>`
- **Componente**: `ResetPasswordView`
- **Funcionalidad**: Permite al usuario crear una nueva contraseña usando un token válido

### 3. Enlace en Login

- Se agregó un enlace "¿Olvidaste tu contraseña?" en el formulario de login principal

## Estructura de Archivos

```
src/
├── pages/
│   └── auth/
│       └── views/
│           ├── login.view.tsx (modificado)
│           ├── forgot-password.view.tsx (nuevo)
│           └── reset-password.view.tsx (nuevo)
├── services/
│   └── api.service.ts (modificado)
└── main.tsx (modificado)
```

## Servicios de API

Se agregaron dos nuevos métodos al `AuthService`:

### `forgotPassword(email: string)`

- **Endpoint**: `POST /auth/forgot-password`
- **Payload**: `{ email: string }`
- **Respuesta**: `{ message: string }`

### `resetPassword(token: string, password: string)`

- **Endpoint**: `POST /auth/reset-password`
- **Payload**: `{ token: string, password: string }`
- **Respuesta**: `{ message: string }`

## Flujo de Usuario

1. **Solicitud de Recuperación**:

   - Usuario va a `/auth/forgot-password`
   - Ingresa su correo electrónico
   - Recibe un correo con un enlace de recuperación

2. **Restablecimiento**:
   - Usuario hace clic en el enlace del correo
   - Es redirigido a `/auth/reset-password?token=<token>`
   - Ingresa su nueva contraseña
   - Confirma la contraseña
   - Es redirigido al login

## Validaciones

### Página de Solicitud

- Validación de formato de correo electrónico
- Prevención de envío múltiple durante la carga

### Página de Restablecimiento

- Validación de token en la URL
- Contraseña mínima de 6 caracteres
- Confirmación de contraseña debe coincidir
- Redirección automática si el token es inválido

## Características de UI/UX

- **Diseño Consistente**: Mantiene el mismo diseño visual que el login
- **Animaciones**: Transiciones suaves con Framer Motion
- **Feedback Visual**: Alerts con SweetAlert2
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Estados de Carga**: Indicadores visuales durante las operaciones

## Configuración Necesaria

Para completar la implementación, necesitas:

1. **Configurar los endpoints en tu backend**:

   - `POST /auth/forgot-password`
   - `POST /auth/reset-password`

2. **Configurar el servicio de correo** en tu backend para enviar los enlaces de recuperación

3. **Proporcionar los detalles del endpoint** para finalizar la configuración

## Próximos Pasos

Una vez que proporciones los detalles del endpoint, se pueden:

1. Ajustar los payloads de las requests según tu API
2. Manejar casos de error específicos
3. Personalizar los mensajes de respuesta
4. Agregar validaciones adicionales si es necesario

## Rutas Configuradas

- `/auth/login` - Inicio de sesión
- `/auth/forgot-password` - Solicitud de recuperación
- `/auth/reset-password` - Restablecimiento de contraseña

Todas las rutas de autenticación están protegidas con `AuthRedirect` para redirigir usuarios ya autenticados.
