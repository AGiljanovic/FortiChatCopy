import mongoose from "mongoose";
import User from "../models/user.js";
import sanitize from 'mongo-sanitize';
import logger from "../logger";


/* ✅ Checker for Valid MongoDB ObjectId ✅ */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/* 👓 Read 👓 */
export const getUser = async (req, res) => {
  try {
    const sanitizedId = sanitize(req.params.id);
    if (!isValidObjectId(sanitizedId)) {
      logger.warn(`Get User: Invalid user ID format ${sanitizedId}`);
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const user = await User.findById(sanitizedId).select('-password -otherSensitiveField');
    if (!user) {
      logger.warn(`Get User: User not found for ID ${sanitizedId}`);
      return res.status(404).json({ message: "User not found." });
    }
    logger.info(`User details retrieved for ID ${sanitizedId}`);
    res.status(200).json(user);
  } catch (err) {
    logger.error(`Get User Error: ${err.message}`);
    res.status(500).json({ message: "Internal server error." });
  }
};

/* 👯‍♀️ Read User Friends 👯‍♀️ */
export const getUserFriends = async (req, res) => {
  try {
    const sanitizedId = sanitize(req.params.id);
    if (!isValidObjectId(sanitizedId)) {
      logger.warn(`Get User Friends: Invalid user ID format ${sanitizedId}`);
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const user = await User.findById(sanitizedId);
    if (!user) {
      logger.warn(`Get User Friends: User not found for ID ${sanitizedId}`);
      return res.status(404).json({ message: "User not found." });
    }

    const friends = await Promise.all(
      user.friends.map((friendId) => {
        const sanitizedFriendId = sanitize(friendId);
        if (!isValidObjectId(sanitizedFriendId)) {
          throw new Error('Invalid friend ID format.');
        }
        return User.findById(sanitizedFriendId).select('_id firstName lastName occupation location picturePath');
      })
    );
    const formattedFriends = friends.map(friend => ({
      _id: friend._id,
      firstName: friend.firstName,
      lastName: friend.lastName,
      occupation: friend.occupation,
      location: friend.location,
      picturePath: friend.picturePath
    }));

    logger.info(`User friends details retrieved for ID ${sanitizedId}`);
    res.status(200).json(formattedFriends);
  } catch (err) {
    logger.error(`Get User Friends Error: ${err.message}`);
    res.status(500).json({ message: "Internal server error." });
  }
};

/* 🔁 Update 🔁 */
export const addRemoveFriend = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sanitizedId = sanitize(req.params.id);
    const sanitizedFriendId = sanitize(req.params.friendId);

    if (!isValidObjectId(sanitizedId) || !isValidObjectId(sanitizedFriendId)) {
      await session.abortTransaction();
      logger.warn(`Add/Remove Friend: Invalid ID format for user ${sanitizedId} or friend ${sanitizedFriendId}`);
      return res.status(400).json({ message: "Invalid user ID or friend ID format." });
    }

    if (sanitizedId === sanitizedFriendId) {
      await session.abortTransaction();
      logger.warn(`Add/Remove Friend: Attempt to befriend self for user ${sanitizedId}`);
      return res.status(400).json({ message: "Users cannot befriend themselves." });
    }

    const user = await User.findById(sanitizedId).session(session);
    const friend = await User.findById(sanitizedFriendId).session(session);

    if (!user || !friend) {
      await session.abortTransaction();
      logger.warn(`Add/Remove Friend: User or friend not found for user ${sanitizedId} or friend ${sanitizedFriendId}`);
      return res.status(404).json({ message: "User or friend not found." });
    }

    const userIndex = user.friends.indexOf(sanitizedFriendId);
    const friendIndex = friend.friends.indexOf(sanitizedId);

    if (userIndex > -1) {
      user.friends.splice(userIndex, 1);
      friend.friends.splice(friendIndex, 1);
      logger.info(`Friend removed: User ${sanitizedId} removed friend ${sanitizedFriendId}`);
    } else {
      user.friends.push(sanitizedFriendId);
      friend.friends.push(sanitizedId);
      logger.info(`Friend added: User ${sanitizedId} added friend ${sanitizedFriendId}`);
    }

    await user.save({ session });
    await friend.save({ session });

    await session.commitTransaction();
    session.endSession();

    const updatedFriends = await Promise.all(
      user.friends.map(friendId => User.findById(friendId).select('_id firstName lastName occupation location picturePath'))
    );

    const formattedFriends = updatedFriends.map(friend => ({
      _id: friend._id,
      firstName: friend.firstName,
      lastName: friend.lastName,
      occupation: friend.occupation,
      location: friend.location,
      picturePath: friend.picturePath
    }));

    res.status(200).json(formattedFriends);
  } catch (err) {
    logger.error(`Add/Remove Friend Error: ${err.message}`);
    await session.abortTransaction();
    session.endSession();
    if (err.kind === 'ObjectId') {
        // Id Not a Valid MongoDB ObjectId
        res.status(400).json({ message: "Invalid user ID or friend ID." });
    } else {
        res.status(500).json({ message: "Internal server error." });
    }
}
};
