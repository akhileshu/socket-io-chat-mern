import asyncHandler from "express-async-handler";
import Chat from "../models/chat.js";
import User from "../models/user.js";

export const accessChat = asyncHandler(async (req, res) => {
  // Extract the chat partner's user ID from the request body
  const { chatPartnerId } = req.body;

  // Check if chatPartnerId is missing in the request body and return a 400 response if so
  if (!chatPartnerId) return res.sendStatus(400);

  // Check if a chat exists between the logged-in user and the chat partner
  let isChat = await Chat.find({
    isGroupChat: false,
    // Use $and operator to ensure both users are in the chat
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } }, // Check for the logged-in user
      { users: { $elemMatch: { $eq: chatPartnerId } } }, // Check for the chat partner
    ],
  })
    .populate("users", "-hash") // Populate the 'users' field, excluding hashs
    .populate("latestMessage"); // Populate the 'latestMessage' field

  // Populate the 'latestMessage.sender' field with user information
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender", // Populate the 'sender' property from the 'latestMessage'
    select: "name pic email", // Select these fields from the sender
  });

  // If a chat exists, send the chat details as a response
  if (isChat.length > 0) res.send(isChat[0]);
  else {
    // If no chat exists, create a new chat between the users
    let chatData = {
      chatName: "sender", // You might want to change this to something more descriptive
      isGroupChat: false,
      users: [req.user._id, chatPartnerId], // Include the logged-in user and chat partner
    };
    try {
      // Create the new chat
      const createdChat = await Chat.create(chatData);

      //   todo:Mongoose's .populate() method is designed to work with queries and not with the direct creation of documents. Here's why you can't directly use .populate() with Chat.create(chatData):

      //   Retrieve the newly created chat with user information

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-hash"
      );

      // Send the new chat as a response
      res.status(200).send(fullChat);
    } catch (error) {
      // Handle any errors that occur during chat creation
      res.status(400);
      throw new Error(error.message);
    }
  }
});

export const fetchChats = asyncHandler(async (req, res) => {
  try {
    // populate all fields and sort charts from latest to old
    let allChats = await Chat.find({ users: { $eq: req.user._id } })
      .populate("users", "-hash")
      .populate("groupAdmin", "-hash")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    // this is for latestMessage field
    const result = await User.populate(allChats, {
      path: "latestMessage.sender",
      options: { strictPopulate: false },
      select: "name pic email",
    });
    res.send(result);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
}); 
export const createGroupChat = asyncHandler(async (req, res) => {
  // takes array of users and name of group
  let { users, name } = req.body;
  console.log(users,name)
  if (!users || !name)
    return res.status(400).send({ message: "please fill all fields" });
  // {    json format
  //     "name":"akgroup",
  //     "users":"[\"651dff9f7ca02d8027b3629f\",\"651dffe37ca02d8027b362a2\"]"
  // }
  users = JSON.parse(users);

  if (users.length < 2)
    return res
      .status(400)
      .send({ message: "more than 2 users are required to form a group chat" });
  users.push(req.user._id);
  try {
    const groupChat = await Chat.create({
      chatName: name,
      users,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-hash")
      .populate("groupAdmin", "-hash");
    res.send(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
export const renameGroupChat = asyncHandler(async (req, res) => {
  // req.user - loggedinuser in group admin
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-hash")
    .populate("groupAdmin", "-hash");
  if (!updatedChat) {
    res.status(400);
    throw new Error(error.message);
  } else {
    res.send(updatedChat);
  }
});
export const removefromgroup = asyncHandler(async (req, res) => {
  // req.user - loggedinuser in group admin
  const { chatId, userId } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-hash")
    .populate("groupAdmin", "-hash");
  if (!removed) {
    res.status(400);
    throw new Error("chat not found");
  } else {
    res.send(removed);
  }
});
export const addtogroup = asyncHandler(async (req, res) => {
  // req.user - loggedinuser in group admin
  const {chatId,userId}=req.body
   const added = await Chat.findByIdAndUpdate(
     chatId,
     { $push: { users: userId } },
     { new: true }
   )
     .populate("users", "-hash")
     .populate("groupAdmin", "-hash");
   if (!added) {
     res.status(400);
     throw new Error("chat not found");
   } else {
     res.send(added);
   }
});
