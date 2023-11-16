  import express from "express";
  import bodyParser from "body-parser";
  import mongoose from "mongoose";
  import cors from "cors";
  import dotenv from "dotenv";
  import multer from "multer";
  import helmet from "helmet";
  import morgan from "morgan";
  import path from "path";
  import { fileURLToPath } from "url";
  import authRoutes from "./routes/auth.js";
  import userRoutes from "./routes/users.js";
  import postRoutes from "./routes/posts.js";
  import { register } from "./controllers/auth.js";
  import { createPost } from "./controllers/posts.js";
  import { verifyToken } from "./middleware/auth.js";
  import { apiRateLimiter } from "./middleware/rateLimiter.js";
  import { validatePostCreation, validateRegistrationData } from "./middleware/validation.js";
  import logger from "./utils/logger.js";
  import AWS from 'aws-sdk';
  import multerS3 from 'multer-s3';
  // import User from "./models/user.js";
  // import Post from "./models/post.js";
  // import { users, posts } from "./data/index.js";

  /* 🛠️ Configs 🛠️ */
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  dotenv.config();
  const app = express();
  app.use(express.json());
  app.use(helmet());
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
      },
    })
  );
  app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
  app.use(morgan("common"));
  app.use(bodyParser.json({ limit: "30mb", extended: true }));
  app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
  app.use(cors());
  app.use("/assets", express.static(path.join(__dirname, "public/assets")));

  /* Configure AWS */
  AWS.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION
  });

  const s3 = new AWS.S3();

/* FILE STORAGE with multerS3 */
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    }
  })
});

  /* ROUTES WITH FILES */
  app.post("/auth/register", upload.single("picture"), apiRateLimiter, validateRegistrationData, register);
  app.post("/posts", verifyToken, upload.single("picture"), validatePostCreation,createPost);

  /* ROUTES */
  app.use("/auth", authRoutes);
  app.use("/users", userRoutes);
  app.use("/posts", postRoutes);

  /* 💥 Error Handling 💥 */
  app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      res.status(400).send('File upload error.');
      logger.error('Multer error: ' + err.message);
    } else if (err) {
      logger.error(err.stack);
      res.status(500).send('Internal Server Error!');
    } else {
      next();
    }
  });

  /* MONGOOSE SETUP */
  const PORT = process.env.PORT || 6001;
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      app.listen(PORT, () => logger.info(`Server Port: ${PORT}`));

      /* ADD DATA ONE TIME */
      // User.insertMany(users);
      // Post.insertMany(posts);
    })
    .catch((error) => logger.error(`${error} did not connect`));
