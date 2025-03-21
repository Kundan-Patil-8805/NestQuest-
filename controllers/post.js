import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Post from "../model/Post.js"; // Assuming you have a Post model
import SavedPost from "../model/SavedPost.js"; // Assuming you have a SavedPost model

export const getPosts = async (req, res) => {
  try {
    const query = req.query;

    // Build the filter object
    const filter = {};
    
    if (query.city) filter.city = query.city;
    if (query.type) filter.type = query.type;
    if (query.property) filter.property = query.property;
    if (query.bedroom) filter.bedroom = parseInt(query.bedroom);

    // Handle price range filtering
    if (query.minPrice || query.maxPrice) {
      filter.price = {};
      if (query.minPrice) filter.price.$gte = parseInt(query.minPrice);
      if (query.maxPrice) filter.price.$lte = parseInt(query.maxPrice);
    }

    // Fetch posts from the database
    const posts = await Post.find(filter);
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Failed to get posts", error: err.message });
  }
};


export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id).populate("postDetail").populate({
      path: "user",
      select: "username avatar",
    });

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await SavedPost.findOne({
            postId: id,
            userId: payload.id,
          });
          return res.status(200).json({ ...post.toObject(), isSaved: !!saved });
        }
      });
    }

    res.status(200).json({ ...post.toObject(), isSaved: false });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  try {
    const newPost = new Post({
      ...body.postData,
      userId: tokenUserId,
      postDetail: body.postDetail,
    });

    await newPost.save();
    res.status(200).json(newPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const updateData = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId.toString() !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};
