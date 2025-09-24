import { Router } from 'express';
import { renderLogin, login } from "../controllers/auth.controller.js";

const router = Router();

router.get("/", renderLogin);
router.post("/", login);

export default router;
