import Chat from "../model/Chat.js"; // Chat schema
import User from "../model/user.js"; // User schema

// Get all chats for a user
export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await Chat.find({
      userIDs: { $in: [tokenUserId] },
    });

    // Fetch receiver details for each chat
    const populatedChats = await Promise.all(
      chats.map(async (chat) => {
        const receiverId = chat.userIDs.find((id) => id.toString() !== tokenUserId);
        const receiver = await User.findById(receiverId).select("id username avatar");
        return { ...chat.toObject(), receiver };
      })
    );

    res.status(200).json(populatedChats);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

// Get a specific chat and its messages
export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userIDs: { $in: [tokenUserId] },
    }).populate({
      path: "messages",
      options: { sort: { createdAt: 1 } }, // Sort messages in ascending order by createdAt
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    // Mark chat as seen by the user
    if (!chat.seenBy.includes(tokenUserId)) {
      chat.seenBy.push(tokenUserId);
      await chat.save();
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

// Add a new chat between two users
export const addChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // Check if a chat between these users already exists
    const existingChat = await Chat.findOne({
      userIDs: { $all: [tokenUserId, req.body.receiverId] },
    });

    if (existingChat) {
      return res.status(200).json(existingChat); // Return existing chat
    }

    // Create a new chat
    const newChat = new Chat({
      userIDs: [tokenUserId, req.body.receiverId],
    });

    await newChat.save();
    res.status(201).json(newChat);
  } catch (err) {
    console.error("Error adding chat:", err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

// Mark a chat as read by the user
export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await Chat.findOneAndUpdate(
      {
        _id: req.params.id,
        userIDs: { $in: [tokenUserId] },
      },
      {
        $addToSet: { seenBy: tokenUserId }, // Add tokenUserId to seenBy array if not already present
      },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.error("Error marking chat as read:", err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
