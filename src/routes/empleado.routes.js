import { Router } from 'express';
import { renderEmpleados, getAllEmpleados, createEmpleado, countUsuariosByRol, deleteEmpleadoById } from '../controllers/empleado.controller.js';

const router = Router();

/**
 * Rutas de empleados.
 *
 * @description
 * Define las rutas relacionadas con la gestión de empleados:
 *  - GET / → Renderiza la vista principal de empleados (por ejemplo, lista de empleados).
 */
router.get('/', renderEmpleados);
router.get('/data', getAllEmpleados);
router.post('/', createEmpleado);
router.delete('/:id', deleteEmpleadoById);
router.get('/countUserByRol', countUsuariosByRol)

export default router;
