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
// import chatRouter from "./router/chat.js";
// import messageRouter from "./router/message.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/post", PostRouter);
app.use("/api/auth", authRouter);
app.use("/api/test", testRouter);
app.use("/api/users", userRouter);
// app.use("/api/chats", chatRouter);
// app.use("/api/messages", messageRouter);

app.use("/", (req, res) => {
  res.send("Server is running!!");
});

// Database connection and server start
const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to the database");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); 
  }
}

main();
