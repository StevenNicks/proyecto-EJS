import { Router } from 'express';
import { renderEmpleados } from '../controllers/empleado.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = Router();

router.get("/", authMiddleware, renderEmpleados);

export default router;