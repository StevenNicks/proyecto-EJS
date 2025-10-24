import { Router } from 'express';
import {
   renderResultados,
   getAllResultadosByTamizajeId,
   createResultado,
   getResultadoById,
   updateResultadoById,
   deleteResultadoById
} from '../controllers/resultado.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Rutas
router.get('/tamizaje/:id', authMiddleware, renderResultados);
router.get('/data/tamizaje/:id', authMiddleware, getAllResultadosByTamizajeId);
router.post('/', authMiddleware, createResultado);
router.get('/:id', authMiddleware, getResultadoById);
router.put('/:id', authMiddleware, updateResultadoById);
router.delete('/:id', authMiddleware, deleteResultadoById);

export default router;