import { GraphQLError } from "graphql";
import Recipe from "../../../../models/Recipe.js";
import authMiddleware from "../../middleware/authMiddleware.js";

export async function getRecipe(_: any, { ID }: { ID: string }, context: any) {
  authMiddleware(context);
  const recipe = await Recipe.findById(ID);
  if (!recipe) throw new Error("Recipe not found");
  return recipe;
}
export async function getRecipes(
  _: any,
  { amount }: { amount: number },
  context: any
) {
  const recipes = await Recipe.find().sort({ createdAt: -1 }).limit(amount);
  if (!recipes) return [];
  return recipes;
}

export async function getRecipesByTitle(
  _: any,
  { title }: { title: string },
  context: any
) {
  authMiddleware(context);
  if (title.length < 3) {
    throw new GraphQLError("Title must be at least 3 characters long", {
      extensions: {
        code: "BADREQUEST",
        http: { status: 400 },
      },
    });
  }
  const recipes = await Recipe.find({ title });
  if (!recipes) return [];
  return recipes;
}
