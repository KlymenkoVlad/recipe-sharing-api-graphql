import User from "../../../models/User";
import bcrypt from "bcryptjs";
import { signToken } from "../../../utils/authUtils";
const login = async (_, args, context) => {
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
