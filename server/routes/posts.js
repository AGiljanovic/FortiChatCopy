import express from "express";
import morgan from 'morgan';
import Joi from 'joi';

import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import { apiRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/* 👷‍♀️ Middlewares 👷‍♀️ */
router.use(morgan('combined'));
router.use(apiRateLimiter);

const userIdSchema = Joi.string().required();
const postIdSchema = Joi.string().required();
const likePostSchema = Joi.object({
    like: Joi.boolean().required(),
});

/* 👓 Read 👓 */
router.get("/", verifyToken, getFeedPosts);

router.get("/:userId/posts", verifyToken, async (req, res, next) => {
    const { error } = userIdSchema.validate(req.params.userId);
    if (error) return res.status(400).json({ error: error.details[0].message });
    return next();
}, getUserPosts);

/* 🔄 Update 🔄 */
router.patch("/:id/like", verifyToken, async (req, res, next) => {
    const { error } = postIdSchema.validate(req.params.id);
    if (error) return res.status(400).json({ error: error.details[0].message });
    return next();
}, async (req, res, next) => {
    const { error } = likePostSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    return next();
}, likePost);

export default router;
