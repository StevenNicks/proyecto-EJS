import { Router } from 'express';
import { renderLogin, login, renderRegister } from "../controllers/auth.controller.js";

const router = Router();

router.get("/login", renderLogin);
router.post("/login", login);

router.get("/register", renderRegister);

export default router;
