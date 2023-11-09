import express from "express";
import { login } from "../controllers/auth.js";
import { apiRateLimiter, loginLimiter } from '../middleware/rateLimiter.js';
import { validateLoginData } from "../middleware/validation.js";

const router = express.Router();

/* ⏳ Rate limiter ⏳ */
router.use(apiRateLimiter);

/* ⏰ Login Route ⏰ */
router.post('/login', loginLimiter, validateLoginData, login);

export default router;
