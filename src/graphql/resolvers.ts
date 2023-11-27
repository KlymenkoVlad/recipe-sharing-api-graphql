import Recipe from "../../models/Recipe.js";
import { hashPassword, signToken } from "../../utils/authUtils.js";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";

interface RecipeInput {
  name: string;
  description: string;
}

interface RegisterUserInput {
  name: string;
  username: string;
  password: string;
}

interface LoginUserInput {
  username: string;
  password: string;
}

// args i have as an object, so i can use destructuring down below
export const Query = {
  async recipe(_: any, { ID }: { ID: string }) {
    return await Recipe.findById(ID);
  },
  async getRecipes(_: any, { amount }: { amount: number }) {
    return await Recipe.find().sort({ createdAt: -1 }).limit(amount);
  },
};

export const Mutation = {
  async createRecipe(
    _: any,
    { recipeInput: { name, description } }: { recipeInput: RecipeInput }
  ) {
    const createdRecipe = new Recipe({
      name,
      description,
      createdAt: new Date().toISOString(),
      thumbsUp: 0,
      thumbsDown: 0,
    });

    const res = await createdRecipe.save();
    //TODO Rework this
    // console.log(res._doc);
    // return {
    //   id: res.id,
    //   ...res._doc,
    // };
  },

  async deleteRecipe(_: any, { ID }: { ID: string }) {
    const { deletedCount } = await Recipe.deleteOne({ _id: ID });
    return deletedCount > 0;
  },

  async editRecipe(
    _: any,
    {
      ID,
      recipeInput: { name, description },
    }: { ID: string; recipeInput: RecipeInput }
  ) {
    const { modifiedCount } = await Recipe.updateOne(
      { _id: ID },
      { name, description }
    );
    return modifiedCount > 0;
  },

  async register(
    _: any,
    args: { registerUserInput: RegisterUserInput },
    context: any
  ) {
    const { password, ...rest } = args.registerUserInput;

    const hashedPassword = await hashPassword(password);

    const user = new User({
      ...rest,
      password: hashedPassword,
    });
    await user.save();

    return {
      id: user.id,
      name: user.name,
      username: user.username,
      password: user.password,
      token: signToken(user.id),
    };
  },

  async login(_: any, args: { loginUserInput: LoginUserInput }, context: any) {
    const { username, password } = args.loginUserInput;

    const user = await User.findOne({
      username,
    });
    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    return {
      id: user.id,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      username: user.username,
      token: signToken(user.id),
    };
  },
};

const resolvers = {
  Query,
  Mutation,
};

export default resolvers;
