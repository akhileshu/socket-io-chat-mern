import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  accessChatAsync,
  searchUserAsync,
  selectChatState,
} from "../../features/chat/chatSlice";

function SearchUser() {
  const { error, status, searchedUsersList, chats, chatSwitched } =
    useSelector(selectChatState);

  const [searchText, setSearchText] = useState("");
  const dispatch = useDispatch();
  const handleClick = () => {
    if (!searchText) return;
    dispatch(searchUserAsync(searchText));
  };
  useEffect(() => {
    setSearchText("");
  }, [chatSwitched]);
  return (
    <div className="searchUser">
      <input
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
        placeholder="searchUser"
        type="text"
      />
      <button onClick={handleClick} type="submit">
        go
      </button>
      <div className="results">
        {searchedUsersList.length !== 0 &&
          searchText &&
          searchedUsersList.map((user, index) => {
            return (
              <div
                key={index}
                onClick={() => dispatch(accessChatAsync(user._id))}
              >
                <p>{user.name}</p>
                <p>{user.email}</p>
                <hr />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default SearchUser;
