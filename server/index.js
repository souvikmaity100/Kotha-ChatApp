import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./db/index.js";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Socket.io Server Setup
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://chat.souvikmaity.space"],
  },
});

// Store Online Users
export const userSocketMap = {};

// socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log(`user connected: ${userId}`);

  if (userId) userSocketMap[userId] = socket.id;

  // Emit online users to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log(`user disconnected: ${userId}`);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

//  Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors());

// Routes
app.get("/", (req, res) => res.json({ message: "Server is Live" }));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

connectDB().then(() => {
  server.listen(process.env.PORT || 5000, () =>
    console.log(`Server Started on PORT: ${process.env.PORT || 5000}`)
  );
});
