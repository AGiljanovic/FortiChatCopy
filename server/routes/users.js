import express from "express";
import morgan from 'morgan';
import Joi from 'joi';

import { getUser, getUserFriends, addRemoveFriend } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
import { apiRateLimiter } from '../middleware/rateLimiter.js';


const router = express.Router();

/* 👷‍♀️ Middlewares 👷‍♀️ */
router.use(morgan('combined'));
router.use(apiRateLimiter);

const userIdSchema = Joi.string().required();
const friendIdSchema = Joi.string().required();

/* 👓 Read 👓 */
router.get("/:id", verifyToken, async (req, res, next) => {
    const { error } = userIdSchema.validate(req.params.id);
    if (error) return res.status(400).json({ error: "Invalid input provided" });
    return next();
}, getUser);

router.get("/:id/friends", verifyToken, async (req, res, next) => {
    const { error } = userIdSchema.validate(req.params.id);
    if (error) return res.status(400).json({ error: "Invalid input provided" });
    return next();
}, getUserFriends);

/* 🔄 Update 🔄 */
router.patch("/:id/:friendId", verifyToken, async (req, res, next) => {
    const { error: errorUserId } = userIdSchema.validate(req.params.id);
    const { error: errorFriendId } = friendIdSchema.validate(req.params.friendId);

    if (errorUserId || errorFriendId) return res.status(400).json({ error: "Invalid input provided" });

    return next();
}, addRemoveFriend);

export default router;
