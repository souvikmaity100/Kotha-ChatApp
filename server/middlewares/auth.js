import { connectDB } from "../db/index.js";
import User from "../models/User.models.js";
import { verifyToken } from "../utils/jwtToken.js";

export const userAuth = async (req, res, next) => {
  try {
    await connectDB(); // Call DB fro Vercel Serverless Environment

    const token = verifyToken(req.headers.token);
    if (!token) return res.json({ success: false, message: "Invalid Token" });
    const user = await User.findById(token.userId).select("-password");

    if (!user) return res.json({ success: false, message: "User not found" });
    req.user = user;
    next();
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, messgae: error.message });
  }
};
