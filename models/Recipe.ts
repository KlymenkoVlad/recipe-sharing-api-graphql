import { Document, model, Schema, Types } from "mongoose";

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
    title: { type: String, required: true, maxLength: 25 },
    description: { type: String, required: true, maxLength: 1000 },
    ingredients: [{ type: String, required: true }],
    instructions: [{ type: String, required: true }],
    thumbsUp: { type: Number, default: 0 },
    thumbsDown: { type: Number, default: 0 },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default model("Recipe", recipeSchema);
