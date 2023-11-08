import asyncHandler from "express-async-handler";
import Chat from "../models/chat.js";
import User from "../models/user.js";
import Message from "../models/message.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.sendStatus(400);
  }
  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };
  try {
    let message = await Message.create(newMessage);
    // here we are populating the instance of mongoose class i.e message
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    // now inside chat model we need to populate the users array -( which contain multiple users id)
    // message->chat->users[]->user
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    // every chat has the latestMessage field - need to update this
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    console.log(error);
    throw new Error(error.message);
  }
});

export const allMessages = asyncHandler(async (req, res) => {
  // its for fetching all messages for a particular chat
  // i am getting chatId form route params
  try {
    const messages = await Message.find({
      chat: req.params.chatId,
    })
      .populate("sender", "name pic")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    console.log(error);
    throw new Error(error.message);
  }
});
