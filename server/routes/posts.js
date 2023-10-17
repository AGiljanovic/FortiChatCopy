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

/* 📌 Upload post with image 📌 */
router.post("/create", verifyToken, upload.single('picturePath'), async (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({ error: 'Image upload failed' });
    }
    req.body.picturePath = req.file.path;
    return next();
  }, createPost);

export default router;
