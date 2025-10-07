# Instructivo para Crear un Proyecto en Vanilla JS con Node Modules
# README DESACTUALIZADO!!! pendiente actualizacion

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

Con esto se creará una carpeta ``` node_modules ```

## 4. Estructura Básica de Archivos

Crea los siguientes archivos:

```
JERSON-PROYECT
├── node_modules/                # Dependencias instaladas automáticamente por npm
├── src/                         # Código fuente de la aplicación
│   ├── config/                  # Configuración (base de datos, variables de entorno, etc.)
│   ├── controllers/             # Lógica de negocio: reciben requests y devuelven respuestas
│   ├── middlewares/             # Funciones intermedias para validar o procesar requests
│   ├── models/                  # Modelos de datos (ej: esquemas con Mongoose, Sequelize, etc.)
│   ├── routes/                  # Definición de rutas y conexión con controladores
│   ├── views/                   # Plantillas EJS renderizadas en el servidor
│   ├── public/                  # Archivos estáticos (CSS, JS, imágenes, fuentes)
│   └── app.js                   # Configuración principal de Express (middlewares, vistas, etc.)
├── package-lock.json            # Registro exacto de versiones instaladas
├── index.js                     # Punto de entrada de la app (levanta el servidor)
├── package.json                 # Configuración del proyecto: dependencias, scripts, metadata
└── README.md                    # Documentación del proyecto
```