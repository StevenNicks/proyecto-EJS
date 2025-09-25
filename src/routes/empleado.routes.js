import { Router } from 'express';
import { getAllEmpleados } from '../controllers/empleado.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = Router();

router.get('/', authMiddleware, getAllEmpleados);

export default router;