import dotenv from "dotenv";
import express from "express";
import cors from "cors";
// auth
// import passport from "./config/passport.js";
import cookieParser from "cookie-parser";
// for using path
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { connectToDb } from "./config/db.js";
// routes
import userRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";
import messageRoutes from "./routes/message.js";
import notificationRoutes from "./routes/notification.js";
import { errorHandler, notFound } from "./middleware/errorHandling.js";
import { protect } from "./middleware/authMiddleware.js";
// socketio
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Now you can use __dirname as you normally would in CommonJS modules.
dotenv.config();
connectToDb();
const app = express();
app.use(cors());
app.use(express.json());
// routes
app.use("/api/user", userRoutes);
app.use("/api/chat", protect, chatRoutes);
app.use("/api/message", protect, messageRoutes);
app.use("/api/notification", protect, notificationRoutes);

app.get("/", (req, res) => res.send("hi there"));

app.use(notFound);
app.use(errorHandler);
const server = app.listen(process.env.PORT || 8000, () =>
  console.log(`server started on port ${process.env.PORT || 8000}`)
);

const io = new Server(server, {
  pingTimeout: 60000, //60 s wait until userdidnt send any message ,it closes server to save bandwith-resources
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  // Add your socket event handlers here
  //* The socket.join(room) function in the code you provided will both join an existing room with the specified room name or create it if it doesn't already exist. So, if the room exists, it will add the user to the room, and if it doesn't exist, it will create the room and add the user as its first member. This dynamic behavior is a convenient feature of Socket.io, allowing rooms to be created and used on-the-fly as needed.

  socket.on("setup", (userData) => {
    // here frontend will send someData and join the room
    socket.join(userData?._id); //*creating a new room with userData._id as soon as user gets connected because userData?._id is always unique
    console.log(userData?._id);
    socket.emit("connected"); //*this will set socket connection status at client
  });

  // joining a chat : when ever we click on chat it should create a new room with both users
  //* this part of the code is  essential for handling typing /stop typing functionality.
  socket.on("join chat", (room) => {
    socket.join(room); //*(creating a new room / join the existing room) with activeChat._id as soon as user gets active on chatbox
    console.log("user joined room : " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;
    if (!chat?.users) return console.log("chat.users not defined");
    // if i am sending a msg ,i want to emit that msg to everyone except self-sender
    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;
      //* are able to send in userid room which we created on "setup" socket event
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
    console.log("User disconnected");
  });
  socket.on("typing", (room) => {
    //* here for typing and stop typing logic we are emiting in chat room created on "join chat" socket event ,so basically this event is emitted to all users/clients joined in a particular chatroom
    socket.in(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });
  socket.off("setup", () => {
    console.log("User disconnected");
    socket.leave(userData?._id); //* end the userId room
  });
  // socket.on("disconnect", () => {
  //   console.log("User disconnected");
  // });
});
