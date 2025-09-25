import { Router } from 'express';
import { renderError } from "../controllers/error.controller.js";

const router = Router();

router.get("/", renderError);

export default router;
