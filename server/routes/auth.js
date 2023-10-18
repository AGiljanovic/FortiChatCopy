import express from "express";
import Joi from "joi";
import { login } from "../controllers/auth.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.use(loginLimiter);

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(passwordRegex).required()
});

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: "Invalid email or password." });
        }
        next();
    };
};

/* 👤 User Login Route 👤 */
router.post("/login", validate(loginSchema), login);

export default router;
