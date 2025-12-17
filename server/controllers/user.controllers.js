import User from "../models/User.models.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "../utils/cloudnary.js";
import { connectDB } from "../db/index.js";

export const signUpHandler = async (req, res) => {
  try {
    await connectDB(); // Call DB fro Vercel Serverless Environment

    const { fullName, email, password, bio } = req.body;

    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "All fielda are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "Email already registered" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashPass,
      bio,
    });

    const token = generateToken(newUser._id);
    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account Created successfully",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, messgae: error.message });
  }
};

export const signInHandler = async (req, res) => {
  try {
    await connectDB(); // Call DB fro Vercel Serverless Environment

    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Both fielda are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Email nor register" });
    }

    const isPassValid = await bcrypt.compare(password, user.password);

    if (!isPassValid) {
      return res.json({ success: false, message: "Invalid credentials" });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      userData: user,
      token,
      message: "Login successful",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, messgae: error.message });
  }
};

export const checkAuthHandler = async (req, res) => {
  res.json({ success: true, userData: req.user });
};

export const updateProfileHandler = async (req, res) => {
  try {
    await connectDB(); // Call DB fro Vercel Serverless Environment

    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;
    let updatedUser;
    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullName, bio },
        { new: true }
      );
    } else {
      const user = await User.findById(userId);
      if (user.profilePicId) {
        await cloudinary.uploader.destroy(user.profilePicId);
      }

      const upload = await cloudinary.uploader.upload(profilePic, {
        folder: "profile_pics",
        width: 400,
        height: 400,
        crop: "thumb",
        gravity: "auto:face",
        zoom: 0.7,
      });

      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          fullName,
          bio,
          profilePic: upload.secure_url,
          profilePicId: upload.public_id,
        },
        { new: true }
      );
    }
    res.json({ success: true, userData: updatedUser });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, messgae: error.message });
  }
};
