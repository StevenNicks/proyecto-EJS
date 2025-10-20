import { Router } from 'express';
import {
   renderResultados,
   getAllResultadosByTamizajeId
} from '../controllers/resultado.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = Router();

/**
 * Rutas de resultados.
 *
 * @description
 * Define las rutas relacionadas con la gestión de resultados:
 *  - GET / → Renderiza la vista principal de resultados.
 *  - GET /data → Obtiene todos los resultados desde la base de datos.
 *  - GET /:cedula → Obtiene un resultado según su número de cédula desde la base de datos.
 *  - POST / → Crea un nuevo resultado con los datos proporcionados.
 *  - PUT /:cedula → Actualiza la información de un resultado existente identificado por su cédula.
 *  - DELETE /:cedula → Elimina un resultado de la base de datos usando su cédula.
 */
router.get('/tamizaje/:id', authMiddleware, renderResultados);
router.get('/data/:id', authMiddleware, getAllResultadosByTamizajeId);

export default router;
