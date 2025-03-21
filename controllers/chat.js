import Chat from "../model/chat.js";
import User from "../model/user.js";

// Get all chats for a user
export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await Chat.find({
      userIDs: { $in: [tokenUserId] },
    }).populate("messages");

    // Add the receiver's details for each chat
    for (const chat of chats) {
      const receiverId = chat.userIDs.find((id) => id.toString() !== tokenUserId);

      const receiver = await User.findById(receiverId).select("id username avatar");
      chat.receiver = receiver; // Dynamically attach receiver info
    }

    res.status(200).json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

// Get a single chat by ID
export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await Chat.findOne({
      _id: req.params.id,
      userIDs: { $in: [tokenUserId] },
    })
      .populate({
        path: "messages",
        options: { sort: { createdAt: 1 } }, // Sort messages by createdAt
      })
      .populate("userIDs", "id username avatar");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    // Determine the receiver (other participant)
    const otherUserId = chat.userIDs.find((id) => id.toString() !== tokenUserId);

    const receiver = await User.findById(otherUserId).select("id username avatar");

    // Mark the chat as seen by the authenticated user
    if (!chat.seenBy.includes(tokenUserId)) {
      chat.seenBy.push(tokenUserId);
      await chat.save();
    }

    res.status(200).json({ chat, receiver });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

// Add a new chat
export const addChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const newChat = new Chat({
      userIDs: [tokenUserId, req.body.receiverId],
    });

    await newChat.save();
    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

// Mark a chat as read
export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await Chat.findOneAndUpdate(
      {
        _id: req.params.id,
        userIDs: { $in: [tokenUserId] },
      },
      {
        $addToSet: { seenBy: tokenUserId }, // Add user to seenBy array if not already present
      },
      { new: true } // Return the updated document
    );

    if (!chat) {
      return res.status(404).json({ message: "Chat not found!" });
    }

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
  }
};
