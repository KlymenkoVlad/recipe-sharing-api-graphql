import { GraphQLError } from "graphql";
import Recipe from "../../../../models/Recipe.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import User from "../../../../models/User.js";

export async function getRecipe(_: any, { ID }: { ID: string }, context: any) {
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
  if (title.length < 3) {
    throw new GraphQLError("Title must be at least 3 characters long", {
      extensions: {
        code: "BADREQUEST",
        http: { status: 400 },
      },
    });
  }

  const searchRegex = new RegExp(title, "i");

  console.log(title);

  const recipes = await Recipe.find({ title: searchRegex });
  console.log(recipes);

  const filteredRecipes = recipes.filter((recipe) => {
    const commonCharacters = Array.from(title).filter((char) =>
      recipe.title.toLowerCase().includes(char.toLowerCase())
    );
    return commonCharacters.length >= 3;
  });

  if (!filteredRecipes || filteredRecipes.length === 0) {
    throw new GraphQLError("No recipes found", {
      extensions: {
        code: "BADREQUEST",
        http: { status: 400 },
      },
    });
  }

  return recipes;
}

export async function getRecipesByUser(
  _: any,
  { ID }: { ID: string },
  context: any
) {
  const user = await User.findById(ID).populate("recipes");

  if (!user) {
    throw new GraphQLError("No user found", {
      extensions: {
        code: "BADREQUEST",
        http: { status: 400 },
      },
    });
  }

  if (user?.recipes.length === 0) {
    throw new GraphQLError("No recipes found", {
      extensions: {
        code: "BADREQUEST",
        http: { status: 400 },
      },
    });
  }

  const recipes = user?.recipes;

  console.log(recipes);

  return recipes;
}
