import mongoose from "mongoose";
const { Schema } = mongoose;

// const notificationSchema = new Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  

//   notifications: [
//     {
//       chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
//       title: { type: String },
//     }
//   ],
// });

const notificationSchema = new Schema({
  user: String,
  notifications: [{ chatId: String, title: String, _id: false }],
});


const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
