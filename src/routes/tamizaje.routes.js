import { Router } from 'express';
import {
   renderTamizajes,
   getAllTamizajes,
   getTamizajeById,
   createTamizaje,
   updateTamizajeById,
   deleteTamizajeById,
} from '../controllers/tamizaje.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * Rutas de tamizajes.
 *
 * @description
 * Define las rutas relacionadas con la gestión de tamizajes:
 *  - GET / → Renderiza la vista principal de tamizajes.
 *  - GET /data → Obtiene todos los tamizajes desde la base de datos.
 *  - GET /:id → Obtiene un tamizaje según su ID.
 *  - POST / → Crea un nuevo tamizaje con los datos proporcionados.
 *  - PUT /:id → Actualiza la información de un tamizaje existente identificado por su ID.
 *  - DELETE /:id → Elimina un tamizaje de la base de datos usando su ID.
 */
router.get('/', authMiddleware, renderTamizajes);
router.get('/data', authMiddleware, getAllTamizajes);
router.get('/:id', authMiddleware, getTamizajeById);
router.post('/', authMiddleware, createTamizaje);
router.put('/:id', authMiddleware, updateTamizajeById);
router.delete('/:id', authMiddleware, deleteTamizajeById);

export default router;
