import { Router } from 'express';
import {
   renderRoles,
   getAllRoles,
   getRolById,
   createRol,
   updateRolById,
   deleteRolById,
} from '../controllers/rol.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = Router();

/**
 * Rutas de Roles. 
 *
 * @description
 * Define las rutas relacionadas con la gestión de roles:
 *  - GET / → Renderiza la vista principal de Roles.
 *  - GET /data → Obtiene todos los roles desde la base de datos.
 *  - GET /:id → Obtiene un rol según su id desde la base de datos.
 *  - DELETE /:id → Elimina un rol de la base de datos usando su id.
 */
router.get('/', authMiddleware, renderRoles);
router.get('/data', authMiddleware, getAllRoles);
router.get('/:id', authMiddleware, getRolById);
router.post('/', authMiddleware, createRol);
router.put('/:id', authMiddleware, updateRolById);
router.delete('/:id', authMiddleware, deleteRolById);

export default router;