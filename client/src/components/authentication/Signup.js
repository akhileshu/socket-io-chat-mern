import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerAsync } from "../../features/auth/authSlice";

function Signup() {
  const dispatch = useDispatch();
  // states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setloading] = useState(false);
  // pic is optional,remaining mandatory

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      alert("please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      alert("password does not match");
      return;
    } else {
      setloading(true);
      dispatch(
        registerAsync({
          name,
          email,
          password,
          pic: pic ? pic : undefined, //if file not selected pic is "" so dont include in obj
        })
      );
      setloading(false);
    }
  };
  const uploadImage = async (pics) => {
    if (pics === undefined) {
      alert("please select an image");
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      setloading(true);

      // const data = new FormData();
      // data.append("file", pics);
      // data.append("upload_preset", "mern chat app");
      // data.append("cloud_name", "dmtcdgqw9");

      // try {
      //   const response = await axios.post(
      //     "https://api.cloudinary.com/v1_1/dmtcdgqw9/image/upload",
      //     data,
      //     {
      //       headers: {
      //         Authorization: "Bearer EQKZdscA9w9JHGl6X8n6e2FnzXE",
      //       },
      //     }
      //   );
      //   console.log(response)

      //   setPic(response.data.url);
      // } catch (error) {
      //   console.log(error.message);
      // } finally {
      //   setloading(false); // Set loading to false in both success and error cases
      // }

      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "mern chat app");
      data.append("cloud_name", "dmtcdgqw9");
      fetch("https://api.cloudinary.com/v1_1/dmtcdgqw9/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          // console.log(data.url.toString());
          setloading(false);
        })
        .catch((err) => {
          console.log(err);
          setloading(false);
        });
    } else {
      alert("please select an image");
    }
  };

  return (
    <form className="signup">
      <div className="name">
        <label htmlFor="name">name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          id="name"
          type="text"
        />
      </div>
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
      <div className="cnfPassword">
        <label htmlFor="cnfPassword">confirm Password</label>
        <input
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          id="cnfPassword"
          type="text"
        />
      </div>
      <div className="picture">
        <label htmlFor="picture">upload your picture</label>
        <input
          onChange={(e) => uploadImage(e.target.files[0])}
          id="picture"
          type="file"
        />
      </div>
      <button disabled={loading} onClick={handleSubmit} type="submit">
        {loading ? "processing" : "signup"}
      </button>
    </form>
  );
}

export default Signup;
