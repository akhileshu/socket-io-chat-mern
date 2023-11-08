import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AddNotificationAsync,
  fetchMessagesAsync,
  selectChatState,
  sendNewMessageAsync,
  updateMessages,
  updateNotifications,
} from "../../features/chat/chatSlice";
import {
  findUsersForNotification,
  getMsgClass,
  getpartner,
  getpartnerName,
} from "../../utils";
import GroupChatInfo from "./GroupChatInfo";
import { selectAuthState } from "../../features/auth/authSlice";
// socket
import io, { Socket } from "socket.io-client";
import { rootUrl } from "../../constants";
let socket, selectedChatCompare;
function ChatBox() {
  const {
    error,
    status,
    searchedUsersList,
    chats,
    activeChat,
    chatSwitched,
    messages,
    notifications,
  } = useSelector(selectChatState);
  const {
    error: authError,
    userInfo,
    status: authStatus,
  } = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const [moreInfo, setMoreInfo] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messagesFetched, setMessagesFetched] = useState(false);
  // socket

  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

  useEffect(() => {
    // Connect to the Socket.io server
    socket = io(rootUrl); // Replace with your server URL
    // event handlers
    socket.emit("setup", userInfo); //*it will create a room with our userid useful to receive messages
    //* logic is wheter group or one to one chat : we send message in chat room and there form server, socket sends messages to all user room's
    socket.on("connected", () => setSocketConnected(true));
    //* catch this socket events and makes updates

    //* below event is emmited form socket to chat room so this can be communicated to all users connected to this particular chat room
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    /*
    // Clean up the socket connection on unmount
    return () => {
      socket.disconnect();
    };

    */
  }, [userInfo]);
  const handleTyping = (e) => {
    // typing indicator logic
    // typing-self
    // isTyping-partner
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", activeChat._id); //* send chatid /room as argument
    }
    let lastTypingTime = new Date().getTime();
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength) {
        socket.emit("stop typing", activeChat._id); //* send chatid /room as argument
        setTyping(false);
      }
    }, timerLength);
    console.log("hello");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("stop typing", activeChat.id);

    if (newMessage.trim()) {
      dispatch(
        sendNewMessageAsync({ content: newMessage, chatId: activeChat._id })
      )
        .then((response) => {
          // console.log(response.payload)
          //* already we joined room with activeChat._id so we can send messeges in this room
          socket.emit("new message", response.payload);
        })
        .catch((error) => {});
    }
    setNewMessage("");
  };

  useEffect(() => {
    // functionality for recieiving messages-realtime
    // this will run everytime our state's updates
    socket?.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare /* //* chatbox not opened */ ||
        selectedChatCompare._id !==
          newMessageRecieved.chat
            ._id /* //* current active chat is not the chat where we received the new message */
      ) {
        // logic for giving notification for user
        //   // if (!notifications?.messages?.include(newMessageRecieved)) {
        //   if (1) {
        // //     // for a user per chat there will be only one notification
        // //     // group chat
        //     if (newMessageRecieved.chat.isGroupChat) {
        //       const users = findUsersForNotification(newMessageRecieved);
        //       dispatch(
        //         AddNotificationAsync({
        //           chatId: newMessageRecieved.chat._id,
        //           users: JSON.stringify(users),
        //           title: `you have a message in ${newMessageRecieved.chat.chatName}`,
        //         })
        //       );
        //     } else {
        //       // duo chat - no need to notify to sender
        //       dispatch(
        //         AddNotificationAsync({
        //           chatId: newMessageRecieved.chat._id,
        //           users: JSON.stringify([userInfo._id]),
        //           title: `you have a message from ${newMessageRecieved.sender.name}`,
        //         })
        //       );
        //     }
        // //     // dispatch(updateNotifications([newMessageRecieved,...notifications]));
        // //   // give notification- because we are not active with sender/group in chatBox
        // }
      } else {
        if (messagesFetched) {
          dispatch(updateMessages([...messages, newMessageRecieved]));
        }
      }
    });
  });

  useEffect(() => {
    if (activeChat) {
      dispatch(fetchMessagesAsync(activeChat._id))
        .then((response) => {
          setMessagesFetched(true);
          //* every time active chat changes , join the room with activeChat._id
          //* this part of the code is not essential for the core functionality of your application. Removing it won't impact the app's performance or functionality ,its for just console.log stmt.
          socket.emit("join chat", activeChat._id);
          // This block will execute when the fetchMessagesAsync action is successful

          // Do something when the fetching is successful
          // console.log("Messages fetched successfully:", response);

          // You can update your component state or perform other actions here
        })
        .catch((error) => {
          // Handle errors if the fetching fails
          // console.error("Error fetching messages:", error);
          // You can display an error message or take appropriate action in case of an error
        });
      // this will be helpful to decide whether to update the chatBox messages or send a notification-realtime
      selectedChatCompare = activeChat;
    }
  }, [activeChat, dispatch]);
  useEffect(() => {
    setMoreInfo(false);
  }, [chatSwitched]);

  return (
    <div className="chatBox">
      <>
        {activeChat ? (
          <>
            {/* heading */}
            <h3>
              {activeChat.isGroupChat ? (
                <div>{activeChat.chatName}</div>
              ) : (
                <div>{getpartnerName(userInfo._id, activeChat)}</div>
              )}
            </h3>
            {/* content to show in button which sets showMore */}
            <button onClick={() => setMoreInfo((prev) => !prev)}>
              {!moreInfo ? (
                <>
                  {activeChat.isGroupChat ? "more about group" : "show profile"}
                </>
              ) : (
                <>{activeChat.isGroupChat ? "show less" : "show less"}</>
              )}
            </button>

            {/* when moreInfo is true then show bellow content */}

            {moreInfo ? (
              <>
                {activeChat.isGroupChat ? (
                  <GroupChatInfo />
                ) : (
                  <div>
                    <img
                      src={getpartner(userInfo._id, activeChat).pic}
                      alt=""
                    />
                    <p>{getpartner(userInfo._id, activeChat).name}</p>
                    <p>{getpartner(userInfo._id, activeChat).email}</p>
                  </div>
                )}
              </>
            ) : null}

            <hr />
            <div className="messages">
              {messages.length !== 0 &&
                messages.map((message, ind) => {
                  return (
                    <div className={getMsgClass(userInfo._id, message)}>
                      {getMsgClass(userInfo._id, message) === "partner" ? (
                        <div>
                          <img
                            className="senderPic"
                            src={message.sender.pic}
                            alt=""
                          />
                          <p>{message.sender.name}</p>
                        </div>
                      ) : null}
                      <div>{message.content}</div>
                    </div>
                  );
                })}
            </div>

            <hr />
            <form
              onKeyDown={handleTyping}
              onSubmit={handleSubmit}
              className="sendMsgForm"
            >
              {istyping ? <h1>typing...</h1> : <></>}
              <input
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
                type="text"
                placeholder="enter the message"
              />
              <button type="submit">send</button>
            </form>
          </>
        ) : (
          <>
            <h2>please select a chat to start messaging</h2>
          </>
        )}
      </>
    </div>
  );
}

export default ChatBox;
