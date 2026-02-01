import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists", success: false });
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    const token = generateToken(newUser._id);
    res
      .status(201)
      .json({ message: "User registered successfully", token, success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
    const token = generateToken(user._id);
    res.status(200).json({ message: "Login successful", token, success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

// Get User Data
export const getUserData = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ user, success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

export const getPublishedImages = async (req, res) => {
  try {
    const publishedImagemessages = await Chat.aggregate([
      { $unwind: "$messages" },
      { $match: { "messages.isPublished": true, "messages.isImage": true } },
      {
        $project: {
          _id: 0,
          imageUrl: "$messages.content",
          userName: "$userName",
        },
      },
    ]);
    res
      .status(200)
      .json({ images: publishedImagemessages.reverse(), success: true });
  } catch (error) {}
};

// JWT Generate
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
