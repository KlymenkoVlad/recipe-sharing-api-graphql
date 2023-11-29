import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minLength: 3 },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minLength: 3,
    },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("User", UserSchema);
