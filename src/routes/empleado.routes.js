import { Router } from 'express';
import { getAllEmpleados } from '../controllers/empleado.controller.js';

const router = Router();

router.get('/', getAllEmpleados);

export default router;