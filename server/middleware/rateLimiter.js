import rateLimit from 'express-rate-limit';

// 🚫 Rate Limiter - Login Attempts 🚫
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: "Too many login attempts from this IP, please try again in 15 minutes."
});

// 🔒 Rate Limiter - API Requests 🔒
export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, 
    message: 'Too many API requests. Please try again later.'
});
