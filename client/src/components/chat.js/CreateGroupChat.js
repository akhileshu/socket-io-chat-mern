import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createGrpChatAsync,
  searchUserAsync,
  selectChatState
} from "../../features/chat/chatSlice";

function CreateGroupChat() {
  const {
    error,
    chatSwitched,
    status,
    searchedUsersList,
    chats,
    usersForaddInGrp,
  } = useSelector(selectChatState);

  const dispatch = useDispatch();

  const [grpName, setGrpName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [grpUsers, setGrpUsers] = useState([]);

    useEffect(() => {
      setSearchText("");
    }, [chatSwitched]);

  const createGrp = () => {
    const data = {
      name: grpName,
      users: JSON.stringify(grpUsers.map((user) => user?.id)),
    };
    dispatch(createGrpChatAsync(data));
    setGrpName("")
    setSearchText("");
    setGrpUsers([]);
    // console.log(data);
  };
  const handleUserAdd = (id, name) => {
    const foundUser = grpUsers.find((user) => user?.id === id);
    if (!foundUser) setGrpUsers((data) => [...data, { id, name }]);
  };
  const handleRemoveUser = (id) => {
    const newList = grpUsers.filter((user) => user?.id !== id);

    setGrpUsers(newList);
  };
  return (
    <>
      <div className="createGroupChat">
        <p>createGroupChat</p>
        <div>
          <input
            placeholder="group Name"
            value={grpName}
            onChange={(e) => setGrpName(e.target.value)}
            type="text"
          />
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
        <div className="grpUsers">
          {grpUsers.length !== 0 &&
            grpUsers.map((user, ind) => {
              return (
                user && (
                  <span onClick={() => handleRemoveUser(user.id)} key={ind}>
                    {user.name} |{" "}
                  </span>
                )
              );
            })}
        </div>
        {searchedUsersList.length !== 0 &&
          searchText &&
          searchedUsersList.map((user) => {
            return (
              <div onClick={() => handleUserAdd(user._id, user.name)}>
                {user?.name}
              </div>
            );
          })}
        <div>
          <button onClick={createGrp}>create</button>
        </div>
      </div>
    </>
  );
}

export default CreateGroupChat;
