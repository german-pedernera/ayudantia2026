# 🎉 Sistema de Gestión de Aniversarios

Sistema web profesional para gestionar aniversarios de personas e instituciones con notificaciones automáticas por Telegram.

## Tecnologías

- **Frontend:** React + Vite + Material UI
- **Backend:** Firebase (Auth, Firestore, Cloud Functions, Hosting)
- **Notificaciones:** Telegram Bot API

## Requisitos Previos

- Node.js 18+
- npm 9+
- Cuenta de Firebase (Plan Blaze para Cloud Functions)
- Bot de Telegram (creado con @BotFather)

## Instalación

### 1. Clonar e instalar dependencias

```bash
npm install
```

### 2. Configurar Firebase

1. Ir a [Firebase Console](https://console.firebase.google.com/)
2. El proyecto ya está configurado: `agenda2026-13cbf`
3. Habilitar **Authentication > Anonymous** en la consola
4. Crear la base de datos **Firestore** si no existe
5. Las credenciales ya están en el archivo `.env`

### 3. Habilitar Autenticación Anónima

En Firebase Console > Authentication > Sign-in method:
- Habilitar **Anonymous** provider

### 4. Crear usuarios en Firestore

Crear la colección `usuarios` con los siguientes documentos (opcional, las credenciales están hardcodeadas):

```
Colección: usuarios
Documento: user1
  - username: "Ger25$"
  - password: "Emi25$"

Documento: user2
  - username: "Noe2026$"
  - password: "Noe2026$"
```

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Credenciales de Acceso

| Usuario | Contraseña |
|---------|------------|
| Ger25$  | Emi25$     |
| Noe2026$ | Noe2026$  |

## Despliegue en Firebase

### Frontend (Hosting)

```bash
npm run build
firebase deploy --only hosting
```

### Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### Cloud Functions

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### Todo junto

```bash
npm run build
firebase deploy
```

## Configurar Telegram

1. Crear un bot con [@BotFather](https://t.me/botfather) en Telegram
2. Copiar el **Token** del bot
3. Obtener el **Chat ID** del grupo o chat
4. En la app, ir a **Configuración** y pegar Token y Chat ID
5. Usar "Enviar Mensaje de Prueba" para verificar

## Estructura del Proyecto

```
├── functions/              # Firebase Cloud Functions
│   ├── index.js            # Función programada de notificaciones
│   └── package.json
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── Layout/         # Sidebar, Header, MainLayout
│   │   ├── ConfirmDialog.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/           # Context API
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/              # Custom hooks
│   │   ├── useAniversarios.js
│   │   ├── useConfig.js
│   │   ├── useInstituciones.js
│   │   └── usePersonas.js
│   ├── pages/              # Páginas de la app
│   │   ├── Calendario.jsx
│   │   ├── Configuracion.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Instituciones.jsx
│   │   ├── Login.jsx
│   │   ├── Personas.jsx
│   │   └── Reportes.jsx
│   ├── services/           # Servicios Firebase
│   │   ├── authService.js
│   │   ├── configService.js
│   │   ├── firebase.js
│   │   ├── institucionesService.js
│   │   └── personasService.js
│   ├── theme/
│   │   └── theme.js        # Temas MUI (claro/oscuro)
│   ├── utils/
│   │   ├── dateUtils.js    # Utilidades de fechas
│   │   ├── exportUtils.js  # Exportación PDF/Excel
│   │   └── validators.js   # Validaciones
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env                    # Variables de entorno
├── .env.example            # Plantilla de variables
├── firebase.json           # Configuración Firebase
├── firestore.rules         # Reglas de seguridad
└── index.html
```

## Características

- ✅ Login con credenciales
- ✅ Dashboard con estadísticas
- ✅ CRUD de Personas con cálculo automático de edad
- ✅ CRUD de Instituciones
- ✅ Calendario interactivo con eventos coloreados
- ✅ Búsqueda en vivo, ordenamiento y paginación
- ✅ Reportes exportables (PDF / Excel)
- ✅ Notificaciones automáticas por Telegram
- ✅ Modo oscuro / claro
- ✅ Diseño responsive
- ✅ Confirmación antes de eliminar
- ✅ Mensajes Toast
- ✅ Rutas protegidas
