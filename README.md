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

Puedes instalar dependencias como [lite-server](https://www.npmjs.com/package/lite-server) para desarrollo local:

```bash
npm install --save-dev lite-server
```

## 4. Estructura Básica de Archivos

Crea los siguientes archivos:

```
/mi-proyecto-vanilla-js
   ├── index.html
   ├── main.js
   └── package.json
```

Ejemplo de `index.html`:

```html
<!DOCTYPE html>
<html lang="es">
   <head>
      <meta charset="UTF-8" />
      <title>Proyecto Vanilla JS</title>
   </head>
   <body>
      <h1>Hola Vanilla JS</h1>
      <script src="main.js"></script>
   </body>
</html>
```

Ejemplo de `main.js`:

```js
console.log("¡Proyecto Vanilla JS funcionando!");
```

## 5. Configurar el Script de Inicio

En `package.json`, agrega:

```json
"scripts": {
   "start": "lite-server"
}
```

## 6. Iniciar el Proyecto

```bash
npm start
```

Esto abrirá tu proyecto en el navegador.

---

## 7. Estructura del proyecto

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

¡Listo! Ahora tienes un proyecto Vanilla JS con dependencias gestionadas por npm.