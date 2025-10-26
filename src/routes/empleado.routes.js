import { Router } from 'express';
import {
   renderEmpleados,
   getAllEmpleados,
   getEmpleadoByCedula,
   createEmpleado,
   updateEmpleadoByCedula,
   deleteEmpleadoByCedula,
   getMisResultados
} from '../controllers/empleado.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = Router();

router.get('/', authMiddleware, renderEmpleados);
router.get('/data', authMiddleware, getAllEmpleados);
router.get('/:cedula', authMiddleware, getEmpleadoByCedula);
router.get('/mis-resultados/data', authMiddleware, getMisResultados);
router.post('/', authMiddleware, createEmpleado);
router.put('/:cedula', authMiddleware, updateEmpleadoByCedula);
router.delete('/:cedula', authMiddleware, deleteEmpleadoByCedula);

export default router;