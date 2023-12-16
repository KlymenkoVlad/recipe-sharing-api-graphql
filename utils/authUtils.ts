import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

//TODO data should be typed
export const signToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET as string, {
    expiresIn: "14d",
  });
};

export const verifyToken = (token: string): JwtPayload | null => {
  if (!token) return null;
  return jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
};
