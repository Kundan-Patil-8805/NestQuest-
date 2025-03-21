import User from "../models/User.js";
import SavedPost from "../models/SavedPost.js"; // Ensure this is defined in your project
import Post from "../models/Post.js"; // Ensure this is defined in your project
import Chat from "../models/Chat.js"; // Ensure this is defined in your project

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get users",
      error: error.message,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get user",
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const tokenUserId = req.userId;
    const { username, avatar } = req.body;

    if (!username && !avatar) {
      return res.status(400).json({ message: "At least one field (username or avatar) is required" });
    }

    if (id !== tokenUserId) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};

export const savePost = async (req, res) => {
  const { postId } = req.body;
  const tokenUserId = req.userId;

  try {
    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const savedPost = await SavedPost.findOne({ userId: tokenUserId, postId });

    if (savedPost) {
      await SavedPost.findByIdAndDelete(savedPost._id);
      res.status(200).json({ message: "Post removed from saved list" });
    } else {
      const newSavedPost = new SavedPost({ userId: tokenUserId, postId });
      await newSavedPost.save();
      res.status(200).json({ message: "Post saved successfully" });
    }
  } catch (err) {
    res.status(500).json({
      message: "Failed to save/remove post",
      error: err.message,
    });
  }
};

export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    if (!tokenUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userPosts = await Post.find({ user: tokenUserId });

    const saved = await SavedPost.find({ user: tokenUserId }).populate("post");

    const savedPosts = saved.map((item) => item.post);

    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch profile posts",
      error: err.message,
    });
  }
};

export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const number = await Chat.countDocuments({
      userIDs: { $in: [tokenUserId] },
      seenBy: { $ne: tokenUserId },
    });

    res.status(200).json({ status: "success", number });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Failed to get notification count",
      error: err.message,
    });
  }
};
