import mongoose from "mongoose";
import User from "../models/user.js";
import sanitize from 'mongo-sanitize';

/* ✅ Checker for Valid MongoDB ObjectId ✅ */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/* 👓 Read 👓 */
export const getUser = async (req, res) => {
  try {
    const sanitizedId = sanitize(req.params.id);
    if (!isValidObjectId(sanitizedId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const user = await User.findById(sanitizedId).select('-password -otherSensitiveField');
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Internal server error." });
  }
};

/* 👯‍♀️ Read User Friends 👯‍♀️ */
export const getUserFriends = async (req, res) => {
  try {
    const sanitizedId = sanitize(req.params.id);
    if (!isValidObjectId(sanitizedId)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const user = await User.findById(sanitizedId);
    if (!user) {
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

    res.status(200).json(formattedFriends);
  } catch (err) {
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
      return res.status(400).json({ message: "Invalid user ID or friend ID format." });
    }

    if (sanitizedId === sanitizedFriendId) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Users cannot befriend themselves." });
    }

    const user = await User.findById(sanitizedId).session(session);
    const friend = await User.findById(sanitizedFriendId).session(session);

    if (!user || !friend) {
      await session.abortTransaction();
      return res.status(404).json({ message: "User or friend not found." });
    }

    const userIndex = user.friends.indexOf(sanitizedFriendId);
    const friendIndex = friend.friends.indexOf(sanitizedId);

    if (userIndex > -1) {
      user.friends.splice(userIndex, 1);
      friend.friends.splice(friendIndex, 1);
    } else {
      user.friends.push(sanitizedFriendId);
      friend.friends.push(sanitizedId);
    }

    await user.save({ session });
    await friend.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Log Success of Addition or Removal of Friend 
    console.log(`User ${sanitizedId} updated friends list: ${sanitizedFriendId} ${user.friends.includes(sanitizedFriendId) ? 'added' : 'removed'}.`);

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
