import express from "express";
import { getChat, getChats, readChat, addChat } from "../controllers/chat.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Route to get all chats for a user
router.get("/", verifyToken, getChats);

// Route to get a specific chat by ID
router.get("/:id", verifyToken, getChat);

// Route to add a new chat
router.post("/", verifyToken, addChat);

// Route to mark a chat as read
router.put("/read/:id", verifyToken, readChat);

export default router;
