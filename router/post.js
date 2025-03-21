import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  addPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../controllers/post.js";

const router = express.Router();

// Routes for posts
router.get("/", getPosts); // Fetch all posts
router.get("/:id", getPost); // Fetch a single post by ID
router.post("/", verifyToken, addPost); // Add a new post (requires authentication)
router.put("/:id", verifyToken, updatePost); // Update a post by ID (requires authentication)
router.delete("/:id", verifyToken, deletePost); // Delete a post by ID (requires authentication)

export default router;
