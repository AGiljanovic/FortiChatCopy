import express from "express";
import morgan from 'morgan';
import multer from 'multer';
import joi from 'joi';

import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import { apiRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/* 👷‍♀️ Middlewares 👷‍♀️ */
router.use(morgan('combined'));
router.use(apiRateLimiter);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  });
  
  const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  };

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

const userIdSchema = joi.string().required();
const postIdSchema = joi.string().required();
const likePostSchema = joi.object({
    like: joi.boolean().required(),
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
