import React from "react";
import { useDispatch } from "react-redux";
import { updateUserInfo } from "../../features/auth/authSlice";

function Header() {
  const dispatch = useDispatch();
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    dispatch(updateUserInfo(null));
  };
  return (
    <div className="navBar">
      <div className="notificationIcon">ntfy</div>
      <div className="profileIcon">pfl</div>
      <div onClick={handleLogout} className="logoutIcon">
        lgut
      </div>
    </div>
  );
}

export default Header;
