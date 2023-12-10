import Recipe from "../../../../models/Recipe.js";

export async function recipe(_: any, { ID }: { ID: string }) {
  const recipe = await Recipe.findById(ID);
  if (!recipe) throw new Error("Recipe not found");
  return recipe;
}
export async function getRecipes(_: any, { amount }: { amount: number }) {
  const recipes = await Recipe.find().sort({ createdAt: -1 }).limit(amount);
  if (!recipes) return [];
  return recipes;
}

export async function getRecipesByTitle(_: any, { title }: { title: string }) {
  if (title.length < 3) {
    throw new Error("Title must be at least 3 characters long");
  }
  const recipes = await Recipe.find({ title });
  if (!recipes) return [];
  return recipes;
}
