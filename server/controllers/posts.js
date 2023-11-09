import mongoose from "mongoose";
import Post from "../models/post.js";
import User from "../models/user.js";
import sanitize from 'mongo-sanitize';

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
      return res.status(400).json({ message: "Invalid data provided." });
    }

    if (description) {
      description = sanitizeString(description);
      if (description.length > 500) {
        return res.status(400).json({ message: "Description is too long." });
      }
    }

    const user = await User.findById(userId);
    if (!user) {
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
    res.status(201).json(newPost);
  } catch (err) {
    console.error(`Error creating post: ${err.message}`);
    res.status(500).json({ message: "An error occurred while creating the post." });
  }
};

/* 👓 Read 👓 */
export const getFeedPosts = async (req, res) => {
  try {
    const posts = await Post.find().limit(100);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve posts." });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const sanitizedUserId = sanitize(req.params.userId);
    
    if (!isValidObjectId(sanitizedUserId)) {
      return res.status(400).json({ message: "Invalid data provided." });
    }

    const posts = await Post.find({ userId: sanitizedUserId });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve user's posts." });
  }
};

/* 🔁 Update 🔁 */
export const likePost = async (req, res) => {
  try {
    const sanitizedId = sanitize(req.params.id);
    const sanitizedUserId = sanitize(req.body.userId);

    if (!isValidObjectId(sanitizedId) || !isValidObjectId(sanitizedUserId)) {
      return res.status(400).json({ message: "Invalid data provided." });
    }

    const post = await Post.findById(sanitizedId);
    if (!post) {
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
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Failed to update post." });
  }
};
