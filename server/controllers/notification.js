import asyncHandler from "express-async-handler";
import Chat from "../models/chat.js";
import User from "../models/user.js";
import Message from "../models/message.js";
import Notification from "../models/notification.js";
import { json } from "express";

export const accessNotifications = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    })
      // messages is a array of messages
      .populate("messages");
    const withSender = await Message.populate(notifications, {
      path: "messages.sender",
      options: { strictPopulate: false },
      select: "name pic email",
    });
    const withSenderNChat = await Message.populate(withSender, {
      path: "messages.chat",
      options: { strictPopulate: false },
      select: "",
    });
    res.json(withSenderNChat);
  } catch (error) {
    res.status(400);
    console.log(error);
    throw new Error(error.message);
  }
});
// export const AddNotification = asyncHandler(async (req, res) => {
//   let { chatId, title, users } = req.body;
//   users = JSON.parse(users);
//   // console.log(chatId,title,users)

//   // Initialize an array to store the results for each user
//   const results = [];

//   // for (const user of users) {
//     // user contains userId
//     const user=users[0]
//     // Check if a notification document exists for the user
//     let notification = await Notification.findOne({ user});

//     if (!notification) {
//       // If no document exists, create a new one
//       notification = await Notification.create({
//         user,
//         notifications: [{ chatId, title }],
//       });
//     } 
//     // else {
//     //   // already exists just need to add one more message
//     //   notification = await Notification.findOneAndUpdate(
//     //     { user: userId },
        
//     //     { $push: { notifications: { chatId, title } } },
//     //     { new: true }
//     //   ); // messages is a array of messages
//     // }

//     results.push(notification);
//   // }
//   if (!results.length) {
//     res.status(400);
//     throw new Error("cant add notifications");
//   } else {
//     res.send(results);
//   }
// });


export const AddNotification = asyncHandler(async (req, res) => {
  // its incomplete running multiple times something error in frontend socket.io code 
  let { chatId, title, users } = req.body;
  users = JSON.parse(users);

  if (users.length === 0) {
    res.status(400);
    throw new Error("No users provided for notifications.");
  }
  const results=[]
  for(const user of users){
    // Check if a notification document exists for the user
    let notification = await Notification.findOne({ user });

    if (!notification) {
      // If no document exists, create a new one
      notification = await Notification.create({
        user,
        notifications: [{ chatId, title }],
      });
    } else {
      // If the document already exists, add one more message
      notification.notifications.unshift({ chatId, title });
      await notification.save();
    }
    results.push(notification)
  }
  res.send(results);
});


export const deleteNotification = asyncHandler(async (req, res) => {
  const { messageId } = req.body;

  const removed = await Notification.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { messages: messageId } },
    { new: true }
  ) // messages is a array of messages
    .populate("messages");
  const withSender = await Message.populate(removed, {
    path: "messages.sender",
    options: { strictPopulate: false },
    select: "name pic email",
  });
  const withSenderNChat = await Message.populate(withSender, {
    path: "messages.chat",
    options: { strictPopulate: false },
    select: "",
  });

  if (!removed) {
    res.status(400);
    throw new Error("chat not found");
  } else {
    res.send(withSenderNChat);
  }
});
