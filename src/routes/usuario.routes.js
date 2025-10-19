import { Router } from 'express';
import {
   renderUsuarios,
   getAllUsuarios,
   countUsuariosByRol,
   getUsuarioByEmail,
   createUsuario,
   updateUsuarioById,
   deleteUsuarioById
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
router.get('/:email', authMiddleware, getUsuarioByEmail);
router.post('/', authMiddleware, createUsuario);
router.put('/:id', authMiddleware, updateUsuarioById);
router.delete('/:id', authMiddleware, deleteUsuarioById);

export default router;
