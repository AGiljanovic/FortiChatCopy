import express from "express";
import Joi from "joi";
import { login } from "../controllers/auth.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.use(loginLimiter);

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: "Invalid input data. Please check and try again." });
        }
        next();
    };
};

/* 👤 User Login Route 👤 */
router.post("/login", validate(loginSchema), login);

export default router;
