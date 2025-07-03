# 🚀 Guía de Uso: Sistema de Persistencia con Zustand

## 📱 Cómo Usar el Sistema

### 1. **Verificar la Implementación**

El sistema ya está configurado y funcionando. Aquí está lo que debes saber:

#### ✅ **Funcionalidades Activas:**

- **Persistencia automática**: Los datos se guardan automáticamente en localStorage
- **Redirección inteligente**: Login redirige al dashboard automáticamente
- **Protección de rutas**: No se puede acceder a login si ya estás autenticado
- **Sincronización multi-tab**: Los cambios se reflejan en todas las pestañas
- **Cache inteligente**: Evita verificaciones excesivas al servidor

### 2. **Probar el Sistema**

#### 🔐 **Flujo de Autenticación:**

1. **Visita la aplicación**: `http://localhost:5173`
2. **Haz login**: Ve a `/login` e inicia sesión
3. **Observa la redirección**: Serás redirigido automáticamente a `/dashboard`
4. **Recarga la página**: Tu sesión se mantiene activa
5. **Abre nueva pestaña**: Ve a `/login` y observa que te redirige al dashboard

#### 🔍 **Debugging en Desarrollo:**

- **Panel de debug**: Aparece en la esquina inferior derecha
- **Información mostrada**: Estado actual vs localStorage
- **Botón de limpieza**: "Limpiar Cache" para resetear todo

### 3. **Comandos de Prueba**

#### 🧪 **En la Consola del Navegador:**

```javascript
// Ver el estado persistido
JSON.parse(localStorage.getItem("titan-auth-storage"));

// Limpiar la persistencia
localStorage.removeItem("titan-auth-storage");

// Recargar para ver el efecto
window.location.reload();
```

#### 📊 **Verificar el Estado:**

```javascript
// Acceder al store desde la consola
window.__ZUSTAND_STORE__ = useAuthStore.getState();
console.log(window.__ZUSTAND_STORE__);
```

### 4. **Escenarios de Prueba**

#### ✅ **Casos de Éxito:**

1. **Login → Dashboard**: Redirección automática
2. **Recarga de página**: Mantiene sesión
3. **Nueva pestaña**: Sincronización correcta
4. **Logout**: Limpieza completa

#### ❌ **Casos de Error:**

1. **Token expirado**: Logout automático
2. **Datos corruptos**: Limpieza y reinicialización
3. **Inconsistencias**: Detección y corrección

### 5. **Configuración Avanzada**

#### ⚙️ **Modificar TTL del Cache:**

```typescript
// En src/store/authStore.ts
const AUTH_CACHE_TTL = 5 * 60 * 1000; // 5 minutos
// Cambiar a: 10 * 60 * 1000 para 10 minutos
```

#### 🔧 **Cambiar Nombre del Storage:**

```typescript
// En src/store/authStore.ts
name: 'titan-auth-storage',
// Cambiar a: 'mi-app-auth' o cualquier nombre único
```

#### 🐛 **Habilitar Logs Detallados:**

```typescript
// En src/store/authStore.ts
console.log("Auth data rehydrated successfully");
// Agregar más logs según necesites
```

### 6. **Monitoreo y Mantenimiento**

#### 📈 **Métricas a Observar:**

- **Tiempo de inicialización**: Debe ser < 100ms
- **Llamadas al servidor**: Máximo 1 por sesión inicial
- **Errores en consola**: Deben ser 0 en uso normal
- **Sincronización**: Instantánea entre tabs

#### 🔄 **Tareas de Mantenimiento:**

- **Limpiar localStorage**: Si hay problemas
- **Actualizar TTL**: Según necesidades de la app
- **Revisar logs**: Para detectar problemas

### 7. **Solución de Problemas**

#### 🚨 **Problemas Comunes:**

**❌ "No se redirige después del login"**

- **Solución**: Verificar que `AuthRedirect` esté configurado
- **Comando**: `localStorage.clear()` y recargar

**❌ "Pierde la sesión al recargar"**

- **Solución**: Verificar que Zustand persist esté configurado
- **Verificar**: `localStorage.getItem('titan-auth-storage')`

**❌ "No sincroniza entre pestañas"**

- **Solución**: Verificar que `useAuthPersistence` esté activo
- **Verificar**: Event listeners de storage

**❌ "Datos inconsistentes"**

- **Solución**: Usar el botón "Limpiar Cache" del debugger
- **Comando**: `localStorage.removeItem('titan-auth-storage')`

### 8. **Mejores Prácticas**

#### ✅ **Recomendaciones:**

1. **No modificar localStorage directamente**: Usar solo el store
2. **Usar el debugger**: Para identificar problemas rápidamente
3. **Limpiar cache**: En caso de problemas extraños
4. **Verificar consistencia**: Comparar estado vs localStorage

#### ⚠️ **Evitar:**

1. **Múltiples fuentes de verdad**: Solo usar Zustand
2. **Modificaciones manuales**: Del localStorage
3. **Bypassing del store**: Usar siempre las acciones del store

---

## 🎉 ¡Todo Listo!

Tu sistema de persistencia está **completamente configurado** y funcionando. La aplicación ahora:

- ✅ **Mantiene las sesiones** entre recargas
- ✅ **Redirige automáticamente** después del login
- ✅ **Protege las rutas** adecuadamente
- ✅ **Sincroniza entre pestañas** automáticamente
- ✅ **Maneja errores** robustamente
- ✅ **Proporciona debugging** avanzado

**¡Disfruta de tu aplicación con persistencia completa!** 🚀

---

_Guía actualizada el 3 de julio de 2025_
