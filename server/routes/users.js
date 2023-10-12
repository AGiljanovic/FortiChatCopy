import express from "express";
import morgan from 'morgan';

import { verifyToken } from "../middleware/auth.js";
import { validate, userIdSchema, friendIdSchema } from '../middleware/validationMiddleware';
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";
import { apiRateLimiter, friendListRateLimiter } from '../middleware/rateLimiter.js'; // Import from your centralized rateLimiter.js file

const router = express.Router();

/* 👷‍♀️ Middlewares 👷‍♀️ */
router.use(morgan('combined'));

router.use(apiRateLimiter);

/* 👓 Read 👓 */
router.get("/:id", verifyToken, validate(userIdSchema, 'params'), getUser);
router.get("/:id/friends", verifyToken, friendListRateLimiter, validate(userIdSchema, 'params'), getUserFriends); // Use the centralized friendList rate limiter 

/* 🔄 Update 🔄 */
router.patch("/:id/:friendId", verifyToken, validate(friendIdSchema, 'params'), addRemoveFriend);

export default router;
