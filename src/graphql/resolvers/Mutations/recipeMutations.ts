import Recipe from "../../../../models/Recipe.js";

interface RecipeInput {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
}

export async function createRecipe(
  _: any,
  {
    recipeInput: { title, description, ingredients, instructions },
  }: { recipeInput: RecipeInput }
) {
  const createdRecipe = new Recipe({
    title,
    description,
  });

  const { _id, thumbsDown, thumbsUp } = await createdRecipe.save();
  //TODO Rework this
  return {
    title,
    description,
    _id,
    thumbsDown,
    thumbsUp,
    ingredients,
    instructions,
  };
}

export async function deleteRecipe(_: any, { ID }: { ID: string }) {
  const { deletedCount } = await Recipe.deleteOne({ _id: ID });
  return deletedCount > 0;
}

export async function editRecipe(
  _: any,
  {
    ID,
    recipeInput: { title, description },
  }: { ID: string; recipeInput: RecipeInput }
) {
  const { modifiedCount } = await Recipe.updateOne(
    { _id: ID },
    { title, description }
  );
  return modifiedCount > 0;
}