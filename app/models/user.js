import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  mail: { type: String, required: true },
  userId: { type: String, required: true },
  accessToken: { type: String, required: true },
  image: { type: String },
});

const User = mongoose.model("User", userSchema, "users");

export default User;
