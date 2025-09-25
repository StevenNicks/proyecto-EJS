// Importar dependencias principales
import express from 'express'
import morgan from 'morgan';
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

const app = express() // Crear instancia de Express

// Obtener __dirname en módulos ES6 (ya que no está disponible por defecto)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");                     // Configurar EJS como motor de vistas
app.set("views", path.join(__dirname, "views"));   // Definir la carpeta donde estarán las vistas (.ejs)

// Hacer pública la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Importar las rutas principales
import authRoutes from './routes/auth.routes.js';
import errorRoutes from './routes/error.route.js';
import empleadoRoutes from './routes/empleado.routes.js';

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
   session({
      secret: process.env.SESSION_SECRET, // viene del .env
      resave: false,
      saveUninitialized: false,
   })
);

// Usar las rutas
// redirects a rutas raiz
app.get('/', (req, res) => res.redirect('/api/login'));
app.get('/api', (req, res) => res.redirect('/api/login'));

app.use('/api/login', authRoutes);
app.use('/api/error', errorRoutes);
app.use('/api/empleados', empleadoRoutes);

app.use('/api/dashboard', (req, res) => {
   res.send('Bienvenido al Dashboard');
});

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
   res.status(404).json({
      message: 'Ruta no encontrada',
   })
})

import { errorHandler } from './middlewares/errorHandler.js';
app.use(errorHandler);

export default app;