import User from "../models/User.models.js";
import { verifyToken } from "../utils/jwtToken.js";

export const userAuth = async (req, res, next) => {
  try {
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
