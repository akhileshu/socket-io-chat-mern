import React from "react";
import {
  selectChatState,
  updateActiveChat,
  updateChatSwitched,
  updateSearchedUsersList,
} from "../../features/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import CreateGroupChat from "./CreateGroupChat";
import { getpartnerName } from "../../utils";
import { selectAuthState } from "../../features/auth/authSlice";

function SideBar() {
  const dispatch = useDispatch();

  const { error, status, searchedUsersList, chats, activeChat } =
    useSelector(selectChatState);
  const {
    error: authError,
    userInfo,
    status: authStatus,
  } = useSelector(selectAuthState);
  return (
    <div className="sidebar">
      <CreateGroupChat />
      {chats &&
        chats.map((chat, ind) => {
          return (
            <div
              className={chat._id === activeChat?._id ? "activeChat" : null}
              key={ind}
              onClick={() => {
                dispatch(updateActiveChat(chat));
                dispatch(updateChatSwitched());
                dispatch(updateSearchedUsersList([]));
              }}
            >
              {chat.isGroupChat
                ? chat.chatName
                : getpartnerName(userInfo._id, chat)}

              <hr />
            </div>
          );
        })}
    </div>
  );
}

export default SideBar;
