import { Hono } from "hono";
import * as authController from "../controllers/auth.controller.js";

const router = new Hono();

router.post("/login", authController.login);

export default router;
