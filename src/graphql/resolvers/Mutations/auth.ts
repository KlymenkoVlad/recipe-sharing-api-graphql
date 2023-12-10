import bcrypt from "bcryptjs";
import User from "../../../../models/User.js";
import { hashPassword, signToken } from "../../../../utils/authUtils.js";

interface UserInput {
  username: string;
  password: string;
}

export const login = async (
  _: any,
  args: { loginUserInput: UserInput },
  context: any
) => {
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
};

export const register = async (
  _: any,
  args: { registerUserInput: UserInput & { name: string } },
  context: any
) => {
  const { password, username, name } = args.registerUserInput;

  if (!username || !password || !name) {
    throw new Error("All fields are required");
  }

  if (username.length < 3) {
    throw new Error("Username must be at least 3 characters long");
  }

  const isUserExist = await User.findOne({
    username,
  });
  if (isUserExist) {
    throw new Error("This username is already taken");
  }

  const hashedPassword = await hashPassword(password);

  const user = new User({
    username,
    name,
    password: hashedPassword,
  });
  await user.save();

  return {
    id: user.id,
    name: user.name,
    username: user.username,
    recipes: [],
    password: user.password,
    token: signToken(user.id),
  };
};
