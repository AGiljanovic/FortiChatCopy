import express from "express";
import { login } from "../controllers/auth.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

/* 🚫 Rate Limiter for Login Attempts 🚫 */
const loginLimiter = rateLimit({
    windowTime: 15 * 60 * 1000, // 15 minutes
    max: 5, // limited to 5 requests
    message: "Too many login attempts from this IP, please try again in 15 minutes."
});

/* 👤 User Login Route (with Rate Limiter applied) 👤 */
router.post("/login", loginLimiter, login);

export default router;
