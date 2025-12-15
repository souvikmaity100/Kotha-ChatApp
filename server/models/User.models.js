import { model, Schema } from "mongoose";

const userSchems = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    profilePicId: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = model("User", userSchems);
export default User;
