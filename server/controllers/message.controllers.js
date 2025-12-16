import Message from "../models/message.models.js";
import User from "../models/User.models.js";
import cloudinary from "../utils/cloudnary.js";
import { io, userSocketMap } from "../index.js";

export const getUsersHandler = async (req, res) => {
  try {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select(
      "-password"
    );

    const unseenMessages = {};
    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);
    res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, messgae: error.message });
  }
};

export const getMessagesHandler = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: userId },
      ],
    });
    await Message.updateMany(
      { senderId: selectedUserId, receiverId: userId },
      { seen: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, messgae: error.message });
  }
};

export const markMessageAsSeenHandler = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, messgae: error.message });
  }
};

export const sendMessageHandler = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResp = await cloudinary.uploader.upload(image, {
        folder: "chat_images",
        width: 1280, // max width
        height: 1280, // max height
        crop: "limit", // 👈 keeps aspect ratio
        quality: "auto:eco",
        fetch_format: "auto",
      });
      imageUrl = uploadResp.secure_url;
    }

    const newMsg = await Message.create({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl || null,
    });

    // Emit the new message to the reciver's socket
    const reciverSocketId = userSocketMap[receiverId];
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("newMsg", newMsg);
    }

    res.json({ success: true, newMsg: newMsg });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, messgae: error.message });
  }
};
