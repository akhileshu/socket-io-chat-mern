import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const generateToken = (id) => {
  // payload,secretkey,expiry
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const generateHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};
export const passwordMatch = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
