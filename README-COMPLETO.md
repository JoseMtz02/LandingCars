# TITAN MOTORS - Landing Page & Dashboard

## 🚛 Descripción

TITAN MOTORS es una aplicación web completa para una empresa de venta de camionetas en México, que incluye:

- **Landing Page profesional** con información de productos, testimonios, precios en MXN y formulario de contacto
- **Sistema de autenticación** con login/logout
- **Dashboard administrativo completo** con funcionalidades CRUD
- **Gestión de usuarios, contactos y mensajes**
- **API REST integrada** para todas las operaciones

## 🎯 Características Principales

### Landing Page

- ✅ Diseño moderno y responsivo con Tailwind CSS
- ✅ Información de productos adaptada a México
- ✅ Precios en pesos mexicanos (MXN)
- ✅ Testimonios de clientes mexicanos
- ✅ FAQ localizado para México
- ✅ Formulario de contacto con validación
- ✅ Integración con reCAPTCHA
- ✅ Páginas de términos y aviso de privacidad

### Sistema de Autenticación

- ✅ Login/Logout seguro con JWT
- ✅ Gestión de sesiones persistentes
- ✅ Rutas protegidas
- ✅ Roles de usuario (admin/user)
- ✅ Validación automática de tokens

### Dashboard Administrativo

- ✅ **Panel de Resumen**: Estadísticas y métricas en tiempo real
- ✅ **Gestión de Usuarios**: CRUD completo para administradores
- ✅ **Gestión de Contactos**: Visualización, asignación y seguimiento
- ✅ **Sistema de Mensajes**: Chat en tiempo real con contactos
- ✅ **Control de Acceso**: Funciones específicas por rol

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19 + TypeScript
- **Estilado**: Tailwind CSS 4
- **Animaciones**: Framer Motion
- **Enrutado**: React Router 7
- **Iconos**: Lucide React
- **Alertas**: SweetAlert2
- **Formularios**: React Hook Form + reCAPTCHA
- **Build Tool**: Vite

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes reutilizables
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── Categories.tsx
│   ├── Testimonials.tsx
│   ├── FAQ.tsx
│   └── ProtectedRoute.tsx
├── contexts/            # Contextos de React
│   ├── AuthContext.tsx
│   └── AuthContextDefinition.ts
├── hooks/               # Hooks personalizados
│   └── useAuth.ts
├── pages/               # Páginas de la aplicación
│   ├── home/           # Landing page
│   ├── auth/           # Login
│   ├── dashboard/      # Dashboard principal
│   │   ├── components/
│   │   │   ├── UsersManagement.tsx
│   │   │   ├── ContactsManagement.tsx
│   │   │   └── MessagesManagement.tsx
│   │   └── views/
│   ├── aviso-privacidad/
│   └── terminos-condiciones/
├── services/           # Servicios de API
│   └── api.service.ts  # Cliente HTTP y servicios
├── types/              # Definiciones de tipos
│   └── auth.ts
└── api/                # Utilidades de API
    └── GenericRequest.ts
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd Frontend-LandingCars
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**
   Crear archivo `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_RECAPTCHA_SITE_KEY=tu-recaptcha-site-key
```

4. **Ejecutar en desarrollo**

```bash
npm run dev
```

5. **Construir para producción**

```bash
npm run build
```

## 🔧 API Endpoints Integrados

### Autenticación

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Usuarios (Solo Administradores)

- `POST /api/auth/users` - Crear usuario
- `GET /api/auth/users` - Listar usuarios
- `GET /api/auth/users/:id` - Obtener usuario
- `PUT /api/auth/users/:id` - Actualizar usuario
- `DELETE /api/auth/users/:id` - Eliminar usuario

### Contactos

- `POST /api/contact` - Crear contacto (público)
- `GET /api/contacts` - Listar todos los contactos (admin)
- `GET /api/contacts/my` - Mis contactos asignados
- `GET /api/contacts/:id` - Obtener contacto
- `PUT /api/contacts/:id` - Actualizar contacto
- `DELETE /api/contacts/:id` - Eliminar contacto
- `PUT /api/contacts/:id/assign` - Asignar contacto
- `POST /api/contacts/:id/follow-up` - Enviar seguimiento

### Mensajes

- `GET /api/messages/unread-count` - Contador no leídos
- `GET /api/messages/contact/:contactId` - Mensajes de contacto
- `POST /api/messages/contact/:contactId` - Crear mensaje
- `POST /api/messages/contact/:contactId/mark-read` - Marcar como leído
- `PUT /api/messages/:id` - Actualizar mensaje
- `DELETE /api/messages/:id` - Eliminar mensaje

### Dashboard

- `GET /api/contacts/stats` - Estadísticas del dashboard

## 👥 Roles de Usuario

### Usuario Regular

- ✅ Acceso al dashboard básico
- ✅ Ver contactos asignados
- ✅ Gestionar mensajes de sus contactos
- ✅ Enviar seguimientos

### Administrador

- ✅ Todas las funciones de usuario regular
- ✅ Gestión completa de usuarios (CRUD)
- ✅ Ver todos los contactos del sistema
- ✅ Asignar contactos a usuarios
- ✅ Estadísticas completas del sistema

## 🔐 Seguridad

- ✅ Autenticación JWT
- ✅ Rutas protegidas por roles
- ✅ Validación de formularios
- ✅ Sanitización de datos
- ✅ Protección CSRF con reCAPTCHA
- ✅ Almacenamiento seguro de tokens

## 📱 Responsive Design

La aplicación está completamente optimizada para:

- 📱 **Móviles** (320px+)
- 📱 **Tablets** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥️ **Large Desktop** (1440px+)

## 🇲🇽 Localización para México

- ✅ Precios en pesos mexicanos (MXN)
- ✅ Teléfonos con formato mexicano
- ✅ Direcciones de Ciudad de México
- ✅ Testimonios de clientes mexicanos
- ✅ FAQ adaptado al mercado mexicano
- ✅ Terminología local (camionetas vs trucks)

## 🚀 Despliegue

### Desarrollo

```bash
npm run dev
```

Accede a: `http://localhost:5173`

### Producción

```bash
npm run build
npm run preview
```

### Variables de Entorno Requeridas

```env
VITE_API_BASE_URL=https://tu-api.com/api
VITE_RECAPTCHA_SITE_KEY=6Lc...
```

## 📞 Soporte

Para soporte técnico o preguntas:

- 📧 Email: soporte@titanmotors.mx
- 📱 Teléfono: +52 55 1234 5678
- 🏢 Oficinas: Ciudad de México, México

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

**TITAN MOTORS** - _Liderando el futuro del transporte comercial en México_ 🚛🇲🇽
