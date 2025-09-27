import { Router } from 'express';
import { renderLogin, login, renderRegister } from "../controllers/auth.controller.js";

const router = Router();

router.get("/login", renderLogin);
router.get("/register", renderRegister);
router.post("/", login);

export default router;
