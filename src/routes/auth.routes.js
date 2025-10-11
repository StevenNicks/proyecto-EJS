import { Router } from 'express';
import {
   renderLogin,
   login,
   renderRegister,
   register,
   logout
} from "../controllers/auth.controller.js";

const router = Router();

/**
 * Rutas de autenticación.
 *
 * @description
 * Define las rutas relacionadas con el sistema de autenticación:
 *  - GET  /login       → Renderiza el formulario de inicio de sesión.
 *  - POST /login       → Procesa las credenciales del usuario.
 *  - GET  /register    → Renderiza el formulario de registro.
 *  - POST /register    → Procesa el registro de un nuevo usuario.
 *  - POST /logout      → Cierra la sesión activa del usuario.
 */
router.get("/login", renderLogin);
router.post("/login", login);
router.get("/register", renderRegister);
router.post("/register", register);
router.post("/logout", logout);

export default router;
