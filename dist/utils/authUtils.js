import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};
//TODO data should be typed
export const signToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "14d",
    });
};
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};
