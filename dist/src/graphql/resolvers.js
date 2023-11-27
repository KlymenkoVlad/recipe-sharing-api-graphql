import Recipe from "../../models/Recipe.js";
import { hashPassword, signToken } from "../../utils/authUtils.js";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";
// args i have as an object, so i can use destructuring down below
export const Query = {
    async recipe(_, { ID }) {
        return await Recipe.findById(ID);
    },
    async getRecipes(_, { amount }) {
        return await Recipe.find().sort({ createdAt: -1 }).limit(amount);
    },
};
export const Mutation = {
    async createRecipe(_, { recipeInput: { name, description } }) {
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
    async deleteRecipe(_, { ID }) {
        const { deletedCount } = await Recipe.deleteOne({ _id: ID });
        return deletedCount > 0;
    },
    async editRecipe(_, { ID, recipeInput: { name, description }, }) {
        const { modifiedCount } = await Recipe.updateOne({ _id: ID }, { name, description });
        return modifiedCount > 0;
    },
    async register(_, args, context) {
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
    async login(_, args, context) {
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
