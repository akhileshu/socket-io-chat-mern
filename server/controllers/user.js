import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import { sanitizedUser } from "../utils.js";
import { generateHash, passwordMatch } from "../config/auth.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("fill all fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("user already exists with this email");
  }
  const user = await User.create({
    name,
    email,
    hash: await generateHash(password),
    pic,
  });
  if (user) {
    res.status(201).json(sanitizedUser(user));
  } else {
    res.status(400);
    throw new Error("failed to create the user");
  }
});

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("fill all fields");
  }
  const user = await User.findOne({ email });
  if (user && (await passwordMatch(password, user.hash))) {
    // default status code is 200 - ok
    res.json(sanitizedUser(user));
  } else {
    res.status(401);
    throw new Error("invalid email or password");
  }
});

// Import the asyncHandler middleware to handle asynchronous operations.
// this api is for searching a user through name or email
export const getAllUsers = asyncHandler(async (req, res) => {
   // Check if there is a 'search' query parameter in the request.
   const keyword = req.query.search
     ? {
         // If 'search' is provided, create a search filter using the '$regex' and '$options' operators.
         $or: [
           // Check if 'name' matches the search term case-insensitively.
           { name: { $regex: req.query.search, $options: "i" } },
           // Check if 'email' matches the search term case-insensitively.
           { email: { $regex: req.query.search, $options: "i" } },
         ],
       }
     : {}; // If 'search' is not provided, create an empty filter.

   // Use the 'User' model to find users in the database that match the 'keyword' filter.
   // Exclude the currently authenticated user by checking that the '_id' is not equal to 'req.user._id'.
   const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
// users can be empty array if user not found with that keyword
   // Send the found users as a response.
   res.send(users);
})

