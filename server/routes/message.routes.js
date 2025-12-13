import { Router } from "express";
import { userAuth } from "../middlewares/auth.js";
import {
  getMessagesHandler,
  getUsersHandler,
  markMessageAsSeenHandler,
  sendMessageHandler,
} from "../controllers/message.controllers.js";

const messageRouter = Router();

messageRouter.get("/users", userAuth, getUsersHandler);
messageRouter.get("/:id", userAuth, getMessagesHandler);
messageRouter.put("/mark/:id", userAuth, markMessageAsSeenHandler);
messageRouter.post("/send/:id", userAuth, sendMessageHandler);

export default messageRouter;
