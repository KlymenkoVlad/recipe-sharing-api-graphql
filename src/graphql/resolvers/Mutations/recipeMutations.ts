import { GraphQLError } from "graphql";
import Recipe from "../../../../models/Recipe.js";
import User from "../../../../models/User.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import { IContext } from "../../../index.js";

interface RecipeInput {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
}

const recipeCheck = async (ID: string, userId: string, isDelete: boolean) => {
  const recipe = await Recipe.findById(ID);
  if (!recipe) {
    throw new GraphQLError("Recipe not found", {
      extensions: {
        code: "BADREQUEST",
        http: { status: 400 },
      },
    });
  }
  if (recipe.userId.toString() !== userId) {
    throw new GraphQLError(
      `You can ${isDelete ? "delete" : "edit"} only your recipes`,
      {
        extensions: {
          code: "UNAUTHORIZED",
          http: { status: 401 },
        },
      }
    );
  }
};

export async function createRecipe(
  _: any,
  {
    recipeInput: { title, description, ingredients, instructions },
  }: { recipeInput: RecipeInput },
  context: IContext
) {
  authMiddleware(context);

  const user = await User.findById(context.userId);
  if (!user) {
    throw new GraphQLError("No user found", {
      extensions: {
        code: "BADREQUEST",
        http: { status: 400 },
      },
    });
  }

  const createdRecipe = new Recipe({
    title,
    description,
    userId: context.userId,
  });

  const { _id, thumbsDown, thumbsUp } = await createdRecipe.save();

  user?.recipes?.push(_id);
  await user.save();

  //TODO Rework this
  return {
    title,
    description,
    _id,
    thumbsDown,
    thumbsUp,
    ingredients,
    instructions,
    userId: context.userId,
  };
}

export async function deleteRecipe(
  _: any,
  { ID }: { ID: string },
  context: IContext
) {
  authMiddleware(context);

  recipeCheck(ID, context.userId, true);

  const { deletedCount } = await Recipe.deleteOne({ _id: ID });
  return "Recipe deleted successfully" && deletedCount > 0;
}

export async function editRecipe(
  _: any,
  {
    ID,
    recipeInput: { title, description },
  }: { ID: string; recipeInput: RecipeInput },
  context: IContext
) {
  authMiddleware(context);

  recipeCheck(ID, context.userId, false);

  const { modifiedCount } = await Recipe.updateOne(
    { _id: ID },
    { title, description }
  );
  return modifiedCount > 0;
}
