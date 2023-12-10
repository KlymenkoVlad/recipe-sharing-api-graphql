import { Document, Schema, model, Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  username: string;
  password: string;
  recipes?: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
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
    recipes: [{ type: Schema.Types.ObjectId, ref: "Recipe" }],
  },
  {
    timestamps: true,
  }
);

export default model("User", UserSchema);
