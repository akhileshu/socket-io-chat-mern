import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatBox from "../components/chat.js/ChatBox";
import Header from "../components/chat.js/Header";
import SearchUser from "../components/chat.js/SearchUser";
import SideBar from "../components/chat.js/SideBar";
import { selectAuthState } from "../features/auth/authSlice";
import { fetchChatsAsync, updateChats } from "../features/chat/chatSlice";
function Chat() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error, userInfo, status } = useSelector(selectAuthState);

  useEffect(() => {
    if (!userInfo) {
      dispatch(updateChats([]))
      navigate("/");
    } //for loginsignup
    
    else dispatch(fetchChatsAsync());
  }, [dispatch, navigate, userInfo]);

  return (
    <>
      {userInfo && (
        <>
          <Header />
          <div className="chatPage">
            <div className="left">
              <SearchUser />
              <SideBar />
            </div>
            <div className="right">
              <ChatBox />
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Chat;
