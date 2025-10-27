import express from 'express';
import { renderLogin, login, renderRegister, register, logout } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'; // ✅ AGREGAR ESTA IMPORTACIÓN

const router = express.Router();

// ✅ RUTAS EXISTENTES (NO MODIFICAR)
router.get('/login', renderLogin);
router.post('/login', login);
router.get('/register', renderRegister);
router.post('/register', register);
router.get('/logout', logout);

// ✅ NUEVA RUTA AGREGADA: PERFIL DEL USUARIO
router.get('/mi-perfil', authMiddleware, (req, res) => {
    res.render('auth/profile', { 
        title: 'Mi Perfil',
        user: req.session.user
    });
});

export default router;