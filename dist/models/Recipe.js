import { model, Schema } from "mongoose";
const recipeSchema = new Schema({
    title: { type: String, required: true, maxLength: 25 },
    description: { type: String, required: true, maxLength: 1000 },
    ingredients: [{ type: String, required: true }],
    instructions: [{ type: String, required: true }],
    thumbsUp: { type: Number, default: 0 },
    thumbsDown: { type: Number, default: 0 },
}, { timestamps: true });
export default model("Recipe", recipeSchema);
