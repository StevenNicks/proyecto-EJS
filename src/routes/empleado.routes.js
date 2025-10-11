import { Router } from 'express';
import {
   renderEmpleados,
   getAllEmpleados,
   getAllEmpleadoByCedula,
   createEmpleado,
   updateEmpleadoByCedula,
   deleteEmpleadoByCedula,
} from '../controllers/empleado.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = Router();

/**
 * Rutas de empleados.
 *
 * @description
 * Define las rutas relacionadas con la gestión de empleados:
 *  - GET / → Renderiza la vista principal de empleados.
 *  - GET /data → Obtiene todos los empleados desde la base de datos.
 *  - GET /:cedula → Obtiene un empleado según su número de cédula desde la base de datos.
 *  - POST / → Crea un nuevo empleado con los datos proporcionados.
 *  - PUT /:cedula → Actualiza la información de un empleado existente identificado por su cédula.
 *  - DELETE /:cedula → Elimina un empleado de la base de datos usando su cédula.
 */
router.get('/', authMiddleware, renderEmpleados);
router.get('/data', authMiddleware, getAllEmpleados);
router.get('/:cedula', authMiddleware, getAllEmpleadoByCedula);
router.post('/', authMiddleware, createEmpleado);
router.put('/:cedula', authMiddleware, updateEmpleadoByCedula);
router.delete('/:cedula', authMiddleware, deleteEmpleadoByCedula);

export default router;
