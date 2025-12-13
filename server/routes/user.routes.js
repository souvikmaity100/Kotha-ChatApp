import { Router } from "express";
import {
  checkAuthHandler,
  signInHandler,
  signUpHandler,
  updateProfileHandler,
} from "../controllers/user.controllers.js";
import { userAuth } from "../middlewares/auth.js";

const userRouter = Router();

userRouter.post("/signup", signUpHandler);
userRouter.post("/signin", signInHandler);
userRouter.put("/profile", userAuth, updateProfileHandler);
userRouter.get("/", userAuth, checkAuthHandler);

export default userRouter;
