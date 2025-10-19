import { Router } from 'express';
import {
   renderTamizajes
} from '../controllers/tamizaje.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = Router();

router.get('/', authMiddleware, renderTamizajes);
// router.get('/data', authMiddleware, getAllTamizajes);

export default router;
