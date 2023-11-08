import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  {
    // generate a timestamep every time a new  message is added/created
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
