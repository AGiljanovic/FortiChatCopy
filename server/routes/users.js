import express from "express";
import morgan from 'morgan';
import joi from 'joi';
import joiObjectId from 'joi-objectid';

import { getUser, getUserFriends, addRemoveFriend } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
import { apiRateLimiter } from '../middleware/rateLimiter.js';


const router = express.Router();

/* 👷‍♀️ Middlewares 👷‍♀️ */
router.use(morgan('combined'));
router.use(apiRateLimiter);

joi.objectId = joiObjectId(joi);

const userIdSchema = joi.objectId().required();
const friendIdSchema = joi.objectId().required();

/* 👓 Read 👓 */
router.get("/:id", verifyToken, async (req, res, next) => {
    try {
        const { error } = userIdSchema.validate(req.params.id);
        if (error) throw new Error("Invalid user ID.");
        return next();
    } catch(err) {
        next(err);
    }
}, getUser);

router.get("/:id/friends", verifyToken, async (req, res, next) => {
    try {
        const { error } = userIdSchema.validate(req.params.id);
        if (error) throw new Error("Invalid user ID.");
        return next();
    } catch(err) {
        next(err);
    }
}, getUserFriends);

/* 🔄 Update 🔄 */
router.patch("/:id/:friendId", verifyToken, async (req, res, next) => {
    try {
        const { error: errorUserId } = userIdSchema.validate(req.params.id);
        const { error: errorFriendId } = friendIdSchema.validate(req.params.friendId);
        if (errorUserId || errorFriendId) throw new Error("Invalid ID(s) provided.");
        return next();
    } catch(err) {
        next(err);
    }
}, addRemoveFriend);

router.use((error, req, res, next) => {
    console.error(error.stack); // Reminder: Remove once I am done -> Security risk
    res.status(500).json({ error: "An internal error occurred." });
});

export default router;
