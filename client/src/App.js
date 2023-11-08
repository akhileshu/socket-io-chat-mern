import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";

import { useDispatch } from "react-redux";

import NotFoundPage from "./components/NotFoundPage";
import Chat from "./pages/Chat.js";
import LoginSignup from "./pages/LoginSignup";
import { updateUserInfo } from "./features/auth/authSlice";

function App() {
  const router = createBrowserRouter([
    {
      path: "/chats",
      element: <Chat />,
    },
    {
      // for home page we are showing login/signup page
      path: "/",
      element: <LoginSignup />,
    },

    {
      path: "/*",
      element: <NotFoundPage />,
    },
  ]);

  const dispatch = useDispatch();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (userInfo) {
      dispatch(updateUserInfo(userInfo));
    }
  }, [dispatch, userInfo]);

  // ! here we can load app only after userChecked  for loader/spinner on every page

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
