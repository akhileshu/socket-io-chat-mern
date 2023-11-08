import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserToGrpAsync,
  changeGrpNameAsync,
  exitFromGrpAsync,
  removeUserFromGrpAsync,
  searchUserAsync,
  selectChatState,
} from "../../features/chat/chatSlice";
import { selectAuthState } from "../../features/auth/authSlice";

function GroupChatInfo() {
  const dispatch = useDispatch();

  const { error, status, searchedUsersList, chats, activeChat } =
    useSelector(selectChatState);
  const {
    error: authError,
    userInfo,
    status: authStatus,
  } = useSelector(selectAuthState);
  // for group chat edit

  const [grpName, setGrpName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [grpUsers, setGrpUsers] = useState([]);
  const admin = activeChat.groupAdmin;
  const adminName = admin._id === userInfo._id ? "You" : admin.name;
  const isAdmin = admin._id === userInfo._id;
  useEffect(() => {
    setGrpName(activeChat?.chatName);
    setGrpUsers(activeChat?.users);
  }, [activeChat?.chatName, activeChat?.users]);

  const handleUserAdd = (_id) => {
    const foundUser = activeChat?.users?.find((user) => user?._id === _id);
    if (!foundUser) {
      const data = {
        chatId: activeChat._id,
        userId: _id,
      };
      dispatch(addUserToGrpAsync(data));
    }
  };

  const handleRemoveUser = (id, name) => {
    const confirm = window.confirm(`remove ${name} form group chat `);
    if (confirm)
      dispatch(removeUserFromGrpAsync({ chatId: activeChat?._id, userId: id }));
  };
  const handleExitGroup = () => {
    const confirm = window.confirm(`confirm to exit group`);
    if (confirm)
      dispatch(
        exitFromGrpAsync({ chatId: activeChat?._id, userId: userInfo._id })
      );
  };
  const handleNameEdit = () => {
    if (!grpName || grpName === activeChat?.chatName) {
      alert("invalid");
      setGrpName(activeChat?.chatName);
      return;
    }
    dispatch(
      changeGrpNameAsync({ chatName: grpName, chatId: activeChat?._id })
    );
  };
  return (
    <>
      <h3>{`admin : ${adminName}`}</h3>
      {isAdmin ? (
        <div>
          <div>
            <label htmlFor="grpName">group name</label>
            <input
              id="grpName"
              placeholder="group Name"
              value={grpName}
              onChange={(e) => setGrpName(e.target.value)}
              type="text"
            />
            <button onClick={handleNameEdit}>edit</button>
          </div>
          <label>click on user to remove</label>
          <div className="grpUsers">
            {/* render a list of group users except self , click on them leads to remove the user */}
            {grpUsers?.map((user, ind) =>
              user._id === userInfo._id ? (
                <>{null}</>
              ) : (
                <>
                  {user && (
                    <span
                      onClick={() => handleRemoveUser(user._id, user.name)}
                      key={ind}
                    >
                      {user.name} |{" "}
                    </span>
                  )}{" "}
                </>
              )
            )}
          </div>

          <div>
            <input
              placeholder="add users"
              value={searchText}
              onChange={(e) => {
                // todo : need to fix better
                setSearchText(e.target.value);
                dispatch(searchUserAsync(e.target.value));
              }}
              type="text"
            />
          </div>

          {searchedUsersList.length !== 0 && searchText && (
            <>
              {searchedUsersList.map((user) => {
                return (
                  <div onClick={() => handleUserAdd(user._id)}>
                    {user?.name}
                  </div>
                );
              })}
            </>
          )}
        </div>
      ) : (
        <>
          <div className="grpUsers">
            {/* render a list of group users except self */}
            {grpUsers?.map((user, ind) =>
              user._id === userInfo._id ? (
                <>{null}</>
              ) : (
                <>{user && <span key={ind}>{user.name} | </span>} </>
              )
            )}
          </div>
        </>
      )}
      {/* this button is common for both admin and normaluser */}
      <div>
        <button onClick={handleExitGroup}>exit group</button>
      </div>
    </>
  );
}

export default GroupChatInfo;
