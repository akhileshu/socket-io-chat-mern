import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
import { selectAuthState } from "../features/auth/authSlice";

function LoginSignup() {
    const navigate = useNavigate();
   const { error, userInfo, status } = useSelector(selectAuthState);
    useEffect(() => {
      if (userInfo) navigate("/chats");
    }, [navigate, userInfo]);
  const [type, setType] = useState("login"); //can either be login /signup
  return (
    <div className="LSContainer">
      <div className="switchBtn">
        <button onClick={() => setType("login")}>login</button>
        <button onClick={() => setType("signup")}>signup</button>
      </div>
      {type === "login" ? <Login /> : <Signup />}
    </div>
  );
}

export default LoginSignup;
