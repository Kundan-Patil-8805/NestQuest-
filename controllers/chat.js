import Chat from "../models/Chat.js";
import User from "../models/User.js";

// Get all chats for a user
export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
      // Fetch all chats where the user is a participant
      const chats = await Chat.find({
          userIDs: { $in: [tokenUserId] },
      }).populate("userIDs", "id username avatar");

      res.status(200).json(chats);
  } catch (err) {
      console.error("Error fetching chats:", err);
      res.status(500).json({ message: "Failed to get chats!" });
  }
};

// export const getChats = async (req, res) => {
//   const tokenUserId = req.userId;

//   try {
//     // Fetch all chats where the user is a participant
//     const chats = await Chat.find({
//       userIDs: { $in: [tokenUserId] },
//     }).populate("messages");

//     // Attach the receiver's details dynamically
//     const chatsWithReceivers = await Promise.all(
//       chats.map(async (chat) => {
//         const receiverId = chat.userIDs.find((id) => id.toString() !== tokenUserId);
//         const receiver = await User.findById(receiverId).select("id username avatar");
//         return { ...chat.toObject(), receiver }; // Combine chat with receiver details
//       })
//     );
//
//     res.status(200).json(chatsWithReceivers);
//   } catch (err) {
//     console.error("Error fetching chats:", err);
//     res.status(500).json({ message: "Failed to get chats!" });
//   }
// };

// Get a single chat by ID
export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // Fetch the chat by ID where the user is a participant
    const chat = await Chat.findOne({
      _id: req.params.id,
      userIDs: { $in: [tokenUserId] },
    })
      .populate({
        path: "messages",
        options: { sort: { createdAt: 1 } }, // Sort messages chronologically
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
    console.error("Error fetching chat:", err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

// Add a new chat
export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const { receiverId } = req.body; // ID of the other participant

  try {
    // Create a new chat with both participants
    const newChat = new Chat({
      userIDs: [tokenUserId, receiverId],
    });

    await newChat.save();
    res.status(201).json(newChat);
  } catch (err) {
    console.error("Error adding chat:", err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

// Mark a chat as read
export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // Update the chat to mark it as seen by the user
    const chat = await Chat.findOneAndUpdate(
      {
        _id: req.params.id,
        userIDs: { $in: [tokenUserId] },
      },
      {
        $addToSet: { seenBy: tokenUserId }, // Add to `seenBy` array if not already present
      },
      { new: true } // Return the updated document
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
