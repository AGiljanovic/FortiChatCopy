import express from "express";
import { getUser, getUserFriends, addRemoveFriend } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
import { validateUserParams } from "../middleware/validation.js"; 
import { apiRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/* Rate limiter */
router.use(apiRateLimiter);

/* READ */
router.get("/:id", verifyToken, validateUserParams, getUser);
router.get("/:id/friends", verifyToken, validateUserParams, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, validateUserParams, addRemoveFriend);

export default router;
