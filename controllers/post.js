import Post from "../model/Post.js";
import jwt from "jsonwebtoken"
// Fetch all posts
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({});
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({
            message: "Failed to retrieve posts",
            error: error.message
        });
    }
};

// import jwt from "jsonwebtoken";

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the post by ID and populate the user information
    const post = await Post.findById(id).populate("user", "name email");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const token = req.cookies?.token;

    let isSaved = false;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const saved = await SavedPost.findOne({
          userId: payload.id,
          postId: id,
        });

        isSaved = !!saved; // Set `isSaved` to true if the post is saved
      } catch (err) {
        console.error("JWT verification failed:", err.message);
        // Proceed without marking the post as saved
      }
    }

    // Return the post with the `isSaved` flag
    res.status(200).json({ ...post.toObject(), isSaved });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({
      message: "Failed to retrieve the post",
      error: error.message,
    });
  }
};


// Add a new post
export const addPost = async (req, res) => {
    try {
      const { postData, postdetail } = req.body;
  
      const user = req.userId; // Assuming middleware adds `userId` to the request
  
      // Create a new Post document
      const newPost = new Post({
        user,
        ...postData, // Spread `postData` fields
        postdetail   // Add `postdetail` as a nested object
      });
  
      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } catch (error) {
      res.status(500).json({
        message: "Failed to create post",
        error: error.message
      });
    }
  };
  

// Update an existing post
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedPost = await Post.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update post",
            error: error.message
        });
    }
};
// Delete a post
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userTokenId = req.userId;

        const postToDelete = await Post.findById(id);

        if (!postToDelete) {
            return res.status(404).json({ message: "Post not found" });
        }
            // fixx after some time 
        if (postToDelete.userId.toString() !== userTokenId) {
            return res.status(403).json({ message: "Not authorized to delete this post" });
        }

        await Post.findByIdAndDelete(id);

        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete post",
            error: error.message
        });
    }
};
