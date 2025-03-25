import express from "express";
import mongoose from "mongoose"; // MongoDB connection
import dotenv from "dotenv"; // Environment variables
import cookieParser from "cookie-parser";
import cors from "cors";

// Routers
import PostRouter from "./router/post.js";
import authRouter from "./router/auth.js";
import testRouter from "./router/test.js";
import userRouter from "./router/user.js";
import chatRouter from "./router/chat.js";
import messageRouter from "./router/message.js"; // Fixed casing for consistency

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// API Routes
app.use("/api/posts", PostRouter); // Consistent route naming
app.use("/api/auth", authRouter);
app.use("/api/tests", testRouter);
app.use("/api/users", userRouter);
app.use("/api/chats", chatRouter);
app.use("/api/messages", messageRouter);

// Fallback route
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" }); // More descriptive for missing routes
});

// Database connection and server start
const PORT = process.env.PORT || 3000;

const main = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL
   );
    console.log("Connected to the database");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1); // Exit process if unable to connect to DB
  }
};

// Run the main function
main();
