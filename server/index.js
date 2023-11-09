import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "url";
import helmet from "helmet";
import mongoose from "mongoose";
import morgan from "morgan";
import multer from "multer";
import path from "path";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import { apiRateLimiter } from "./middleware/rateLimiter.js";
import { validateRegistrationData } from "./middleware/validation.js";
import { validatePostCreation } from "./middleware/validation.js";
// import User from "./models/user.js";
// import Post from "./models/post.js";
// import { users, posts } from "./data/mockData.js";


/* 🛠️ Configs 🛠️ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "same-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "15mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "15mb", extended: true }));
app.use(cors()); // Do not forget -> Add my domain later
app.use("/assets", express.static(path.join(__dirname, "public/assets")));


/* 📂 File Storage 📂 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  },
});
const upload = multer({ storage });

/* 📁 File Upload Routes 📁 */
app.post("/auth/register", upload.single("picture"), apiRateLimiter, validateRegistrationData, register);
app.post("/posts", verifyToken, upload.single("picture"), validatePostCreation,createPost);

/* 🛣️ General Routes 🛣️ */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* 💥 Error Handling 💥 */
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
      res.status(400).send('File upload error.');
  } else if (err) {
      console.error(err.stack);
      res.status(500).send('Internal Server Error!');
  } else {
      next();
  }
});

/* 🪿 Mongoose 🪿 */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Connected To Server On Port: ${PORT}`));

    /* ➕ Add Data 1 Time ➕ */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} failed to connect`));
