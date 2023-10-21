import mongoose from "mongoose";
import sanitize from 'mongo-sanitize';

import User from "../models/user.js";

/* 👓 Read: Get User Info 👓 */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const sanitizedId = sanitize(id);
    const user = await User.findById(sanitizedId);
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while retrieving the user." });
  }
};

/* 📖  Read: Get User Friends 📖 */
export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const sanitizedId = sanitize(id);
    const user = await User.findById(sanitizedId);

    const friends = await Promise.all(
      user.friends.map((friendId) => User.findById(friendId))
    );
    
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    
    res.status(200).json(formattedFriends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while retrieving friends." });
  }
};

/* ➕🔄➖ Update: Add or Remove Friend ➕🔄➖ */
export const addRemoveFriend = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { id, friendId } = req.params;
    const sanitizedId = sanitize(id);
    const sanitizedFriendId = sanitize(friendId);
    
    if (sanitizedId === sanitizedFriendId) throw new Error("User ID and friend ID cannot be the same.");
    
    const user = await User.findById(sanitizedId);
    const friend = await User.findById(sanitizedFriendId);
    
    if (!user || !friend) throw new Error();
    
    if (user.friends.includes(sanitizedFriendId)) {
      user.friends = user.friends.filter((fid) => fid !== sanitizedFriendId);
      friend.friends = friend.friends.filter((fid) => fid !== sanitizedId);
    } else {
      user.friends.push(sanitizedFriendId);
      friend.friends.push(sanitizedId);
    }
    
    await user.save({ session });
    await friend.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    const friends = await Promise.all(user.friends.map((id) => User.findById(id)));
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    
    res.status(200).json(formattedFriends);
    
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    
    res.status(500).json({ message: "An error occurred while updating friend list." });
  }
};
