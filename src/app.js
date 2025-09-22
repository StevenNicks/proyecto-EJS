// Importar dependencias principales
import express from 'express'
import path from "path";
import { fileURLToPath } from "url";

const app = express() // Crear instancia de Express

// Obtener __dirname en módulos ES6 (ya que no está disponible por defecto)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar EJS como motor de vistas
app.set("view engine", "ejs");
// Definir la carpeta donde estarán las vistas (.ejs)
app.set("views", path.join(__dirname, "src/views"));

export default app;