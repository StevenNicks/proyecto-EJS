// Importar dependencias principales
import express from 'express'
import morgan from 'morgan';
import path from "path";
import { fileURLToPath } from "url";

const app = express() // Crear instancia de Express

// Obtener __dirname en módulos ES6 (ya que no está disponible por defecto)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");                     // Configurar EJS como motor de vistas
app.set("views", path.join(__dirname, "views"));   // Definir la carpeta donde estarán las vistas (.ejs)

// Importar las rutas principales
import empleadoRoutes from './routes/empleado.routes.js';

app.use(morgan('dev'));
app.use(express.json());

// Usar las rutas
app.use('/api/empleados', empleadoRoutes);
// app.use('/api/ping', (req, res)=>{
//    res.send("Servidor funcionando")
// });

// Middleware para manejar rutas no encontradas (404)
app.use((req, res, next) => {
   res.status(404).json({
      message: 'Ruta no encontrada',
   })
})

import { errorHandler } from './middlewares/errorHandler.js';
app.use(errorHandler);

export default app;