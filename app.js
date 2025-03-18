import express from "express";
import mongoose from "mongoose"; // MongoDB connection
import dotenv from "dotenv"; // Environment variables
import cookieParser from "cookie-parser";
import cors from "cors";

// Routers
import PostRouter from "./router/post.js";
import authRouter from "./router/auth.js";
import testRouter from "./router/test.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000", // Restrict origins
  credentials: true, // Allow cookies to be sent
}));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/post", PostRouter);
app.use("/api/auth", authRouter);
app.use("/api/test", testRouter);

app.use("/", (req, res) => {
  res.send("Server is running!!");
});

// Database connection and server start
const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit process with failure
  }
}

main();
