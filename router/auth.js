import express from "express";
import { login, logout, register } from "../controllers/auth.js";

const router = express.Router();

// User registration
router.post("/register", register);

// User login
router.post("/login", login);

// User logout
router.post("/logout", logout);

export default router;
