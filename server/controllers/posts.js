import mongoose from "mongoose";
import Post from "../models/post.js";
import User from "../models/user.js";
import sanitize from 'mongo-sanitize';
import logger from "../logger";


/* ✅ Checker for Valid MongoDB ObjectId ✅ */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/* 🪓 Strip HTML Tags From a String 🪓 */
function sanitizeString(str) {
  return str.replace(/<\/?[^>]+(>|$)/g, "");
}

/* 🛠️ Create 🛠️ */
export const createPost = async (req, res) => {
  try {
    const sanitizedBody = sanitize(req.body);
    let { userId, description, picturePath } = sanitizedBody;

    if (!isValidObjectId(userId)) {
      logger.warn("Post creation: Invalid userID provided");
      return res.status(400).json({ message: "Invalid data provided." });
    }

    if (description) {
      description = sanitizeString(description);
      if (description.length > 500) {
        logger.warn("Post creation: Description too long");
        return res.status(400).json({ message: "Description is too long." });
      }
    }

    const user = await User.findById(userId);
    if (!user) {
      logger.warn(`Post creation: User not found for ID ${userId}`);
      return res.status(404).json({ message: "Resource not found." });
    }

    const newPost = new Post({
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });

    await newPost.save();
    logger.info(`New post created by User ID: ${userId}`);
    res.status(201).json(newPost);
  } catch (err) {
    logger.error(`Error creating post: ${err.message}`);
    res.status(500).json({ message: "An error occurred while creating the post." });
  }
};

/* 👓 Read 👓 */
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find().limit(100);
    logger.info("Retrieved feed posts");
    res.status(200).json(posts);
  } catch (err) {
    logger.error("Error retrieving feed posts: " + err.message);
    res.status(500).json({ message: "Failed to retrieve posts." });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const sanitizedUserId = sanitize(req.params.userId);
    
    if (!isValidObjectId(sanitizedUserId)) {
      logger.warn("User post retrieval: Invalid userID provided");
      return res.status(400).json({ message: "Invalid data provided." });
    }

    const posts = await Post.find({ userId: sanitizedUserId });
    res.status(200).json(posts);
  } catch (err) {
    logger.error(`Error retrieving user's posts: ${err.message}`);
    res.status(500).json({ message: "Failed to retrieve user's posts." });
  }
};

/* 🔁 Update 🔁 */
export const likePost = async (req, res) => {
  try {
    const sanitizedId = sanitize(req.params.id);
    const sanitizedUserId = sanitize(req.body.userId);

    if (!isValidObjectId(sanitizedId) || !isValidObjectId(sanitizedUserId)) {
      logger.warn("Like post: Invalid postID or userID provided");
      return res.status(400).json({ message: "Invalid data provided." });
    }

    const post = await Post.findById(sanitizedId);
    if (!post) {
      logger.warn(`Like post: Post not found for ID ${sanitizedId}`);
      return res.status(404).json({ message: "Resource not found." });
    }

    post.likes = post.likes || new Map();
    const isLiked = post.likes.get(sanitizedUserId);

    if (isLiked) {
      post.likes.delete(sanitizedUserId);
    } else {
      post.likes.set(sanitizedUserId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(sanitizedId, { likes: post.likes }, { new: true });
    logger.info(`Post ${sanitizedId} ${action} by User ID: ${sanitizedUserId}`);
    res.status(200).json(updatedPost);
  } catch (err) {
    logger.error(`Error updating post: ${err.message}`);
    res.status(500).json({ message: "Failed to update post." });
  }
};
