// import mongoose from "mongoose";
// import Chat from "../model/Chat.js"; 
// import Message from "../model/Message.js"; 

// export const addMessage = async (req, res) => {
//   const tokenUserId = req.userId;
//   const chatId = req.params.chatId;
//   const text = req.body.text;

//   try {
//     // Find the chat with matching chatId and ensure the user is a participant
//     const chat = await Chat.findOne({
//       _id: chatId,
//       userIDs: { $in: [tokenUserId] },
//     });

//     if (!chat) return res.status(404).json({ message: "Chat not found!" });

//     // Create the new message
//     const message = await Message.create({
//       text,
//       chatId,
//       userId: tokenUserId,
//     });

//     // Update the chat document
//     await Chat.findByIdAndUpdate(chatId, {
//       $addToSet: { seenBy: tokenUserId }, // Add the user to the seenBy array (if not already present)
//       lastMessage: text,
//     });

//     res.status(200).json(message);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to add message!" });
//   }
// };
