import { model, Schema, Types } from "mongoose";

export interface IRecipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  thumbsUp: number;
  thumbsDown: number;
  userId: Types.ObjectId;
}

const recipeSchema = new Schema<IRecipe>(
  {
    title: {
      type: String,
      required: true,
      maxLength: 25,
      minLength: 3,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      maxLength: 1000,
      trim: true,
      minLength: 20,
    },
    ingredients: [{ type: String, required: true, trim: true }],
    instructions: [{ type: String, required: true, trim: true }],
    thumbsUp: { type: Number, default: 0 },
    thumbsDown: { type: Number, default: 0 },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model("Recipe", recipeSchema);
