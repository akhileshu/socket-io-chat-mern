import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginAsync } from "../../features/auth/authSlice";

function Login() {
  const dispatch = useDispatch();
  // states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("please fill all fields");
      return;
    } else {
      try {
        setloading(true);
        dispatch(loginAsync({ email, password }));
      } catch (error) {
        alert(error.message);
        console.log(error);
      } finally {
        setloading(false);
      }
    }
  };

  return (
    <form className="login">
      <div className="email">
        <label htmlFor="email">email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          type="email"
        />
      </div>
      <div className="password">
        <label htmlFor="password">password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          id="password"
          type="password"
        />
      </div>
      <button onClick={handleSubmit} type="submit">
        login
      </button>
      <button type="button">get guest user credentials</button>
    </form>
  );
}

export default Login;
