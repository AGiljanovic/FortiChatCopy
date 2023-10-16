import mongoose from "mongoose";
import User from "../models/User.js";


/* 👓 Read: Get User Info 👓 */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
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
    const user = await User.findById(id);

    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
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

/* ➕🔄➖ Add or Remove Friend ➕🔄➖ */
export const addRemoveFriend = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { id, friendId } = req.params;
    
    if (id === friendId) throw new Error();
    
    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    
    if (!user || !friend) throw new Error();
    
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
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
