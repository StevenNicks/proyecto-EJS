import { Router } from 'express';
import {
   renderUsuarios,
   getAllUsuarios,
   countUsuariosByRol
} from '../controllers/usuario.controlles.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * Rutas de usuarios.
 *
 * @description
 * Define las rutas relacionadas con la gestión de usuarios:
 *  - GET /count-by-rol → Obtiene el conteo total de usuarios agrupados por rol.
 */
router.get('/', authMiddleware, renderUsuarios);
router.get('/data', authMiddleware, getAllUsuarios);
router.get('/count-by-rol', authMiddleware, countUsuariosByRol);

export default router;
