import { Router } from 'express';
import { renderLogin, login, renderRegister, register } from "../controllers/auth.controller.js";

const router = Router();

/**
 * Rutas de autenticación.
 *
 * @description
 * Define las rutas relacionadas con el sistema de autenticación:
 *  - GET  /login      → Renderiza el formulario de login
 *  - POST /login      → Procesa las credenciales del usuario
 *  - GET  /register   → Renderiza el formulario de registro
 *  - POST /register   → Procesa los datos enviados para crear un nuevo usuario
 */
router.get("/login", renderLogin);
router.post("/login", login);
router.get("/register", renderRegister);
router.post("/register", register);

export default router;
