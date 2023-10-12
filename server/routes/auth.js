import express from "express";

import { login } from "../controllers/auth.js";
import { loginLimiter } from "../middleware/rateLimiters.js";


const router = express.Router();

/* 👤 User Login Route (with Rate Limiter) 👤 */
router.post("/login", validate(loginSchema), loginLimiter, login);

export default router;
