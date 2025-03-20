import User from "../model/user.js";

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
        const { id } = req.params; // Extract the ID from request params
        const tokenUserId = req.userId; // Assume `req.userId` is populated by middleware
        const { username, avatar } = req.body; // Extract username and avatar from request body

        if (id !== tokenUserId) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Update both username and avatar fields
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, avatar },
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ updatedUser });
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
    const postId = req.body.postId;
    const tokenUserId = req.userId;
  
    try {
      // Check if the post is already saved by the user
      const savedPost = await SavedPost.findOne({
        userId: tokenUserId,
        postId: postId,
      });
  
      if (savedPost) {
        // If the post is already saved, remove it from the saved list
        await SavedPost.findByIdAndDelete(savedPost._id);
        res.status(200).json({ message: "Post removed from saved list" });
      } else {
        // If the post is not saved, save it to the list
        const newSavedPost = new SavedPost({
          userId: tokenUserId,
          postId: postId,
        });
        await newSavedPost.save();
        res.status(200).json({ message: "Post saved" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to save/remove post" });
    }
  };
  


  
  export const profilePosts = async (req, res) => {
    const tokenUserId = req.userId; // Assuming middleware adds `userId` to the request
  
    try {
      // Find posts created by the user
      const userPosts = await Post.find({ user: tokenUserId });
  
      // Find posts saved by the user
      const saved = await SavedPost.find({ user: tokenUserId }).populate("post");
  
      // Extract the posts from the saved entries
      const savedPosts = saved.map((item) => item.post);
  
      res.status(200).json({ userPosts, savedPosts });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to get profile posts!" });
    }
  };