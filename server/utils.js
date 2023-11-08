import { generateToken } from "./config/auth.js";

export const sanitizedUser = ({ name, email, pic, _id }) => {
  // sanitizedUser does not contain password/hash
  return { name, email, pic, _id, token: generateToken(_id) };
};
