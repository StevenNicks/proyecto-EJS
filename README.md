# Instructivo para crear un proyecto en EJS con Node ES Modules

## 1. Crear la Carpeta del Proyecto

```bash
mkdir mi-proyecto-vanilla-js
cd mi-proyecto-vanilla-js
```

## 2. Inicializar el Proyecto con npm

```bash
npm init -y
```

Esto creará un archivo `package.json`.

## 3. Instalar Dependencias

Puedes instalar dependencias como :

```bash
npm i express
npm i morgan
npm i mysql2
```

Con esto se creará una carpeta `node_modules`

## 4. Estructura Básica de Archivos

Crea los siguientes archivos:

```
PROYECT/
├── node_modules/                # Dependencias instaladas automáticamente por npm
├── src/                         # Código fuente de la aplicación
│   ├── config/                  # Configuración (base de datos, variables de entorno, etc.)
│   │   ├── config.js            # ⚠️ Falta definir si contendrá configuración general o variables globales
│   │   └── db.js                # ⚠️ Falta especificar el tipo de conexión (MongoDB, MySQL, etc.)
│   ├── controllers/             # Lógica de negocio: reciben requests y devuelven respuestas
│   ├── middlewares/             # Funciones intermedias para validar o procesar requests
│   ├── models/                  # Modelos de datos (ej: esquemas con Mongoose, Sequelize, etc.)
│   ├── public/                  # Archivos estáticos (CSS, JS, imágenes, fuentes)
│   │   ├── css/                 # ⚠️ Falta definir estilos base o framework usado (Bootstrap, Tailwind, etc.)
│   │   ├── images/              # ⚠️ Carpeta vacía o sin contenido de ejemplo
│   │   ├── js/                  # ⚠️ Scripts del lado del cliente
│   │   ├── libs/                # ⚠️ Librerías externas (jQuery, Bootstrap, datatables, etc.)
│   │   └── favicon.ico          # Ícono del sitio
│   ├── routes/                  # Definición de rutas y conexión con controladores
│   ├── views/                   # Plantillas EJS renderizadas en el servidor
│   │   ├── auth/                # ⚠️ Vistas relacionadas con autenticación (login, registro)
│   │   ├── empleados/           # ⚠️ Vistas relacionadas con empleados (lista, detalle, edición)
│   │   └── partials/            # Fragmentos reutilizables de vistas
│   │       ├── head.ejs
│   │       ├── header.ejs
│   │       └── scripts.ejs
│   └── app.js                   # Configuración principal de Express (middlewares, vistas, rutas)
├── .env                         # ⚠️ Falta definir variables (PORT, DB_URI, JWT_SECRET, etc.)
├── .gitignore                   # ⚠️ Debe incluir node_modules/, .env y otros archivos temporales
├── index.js                     # Punto de entrada de la app (levanta el servidor)
├── package-lock.json            # Registro exacto de versiones instaladas
├── package.json                 # Configuración del proyecto: dependencias, scripts, metadata
└── README.md                    # Documentación del proyecto

```
