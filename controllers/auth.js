import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/user.js'; // Ensure the correct path to your User model

// Register a new user
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: 'All fields are required',
      });
    }

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: 'Email is already in use',
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Save the hashed password
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success
    res.status(201).json({
      status: "success",
      message: 'User created successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      }, // Return user details without the password
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({
      status: "error",
      message: 'Failed to create user',
    });
  }
};

// Login a user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: 'Email and password are required',
      });
    }

    // Check if the user exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: 'Invalid credentials',
      });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: 'Invalid credentials',
      });
    }

    // Generate a JWT token
    const age = 1000 * 60 * 60 * 24 * 7; // 1 week
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: true,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    // Set token in cookies
    res.cookie('token', token, {
      httpOnly: true,
      //secure : true ,
      maxAge: age,
    }).status(200).json({
      status: "success",
      message: 'Login successful',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      status: "error",
      message: 'Failed to login',
    });
  }
};

// Logout a user
export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      //secure : true ,
    });
    res.status(200).json({
      status: "success",
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({
      status: "error",
      message: 'Failed to logout',
    });
  }
};