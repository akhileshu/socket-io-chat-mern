import axios from "axios";
import { rootUrl } from "../../constants";


// for register
export const register = async (userData) => {
  try {
    const response = await axios.post(`${rootUrl}/api/user`, userData);

    localStorage.setItem("userInfo", JSON.stringify(response.data));
    return response;
  } catch (error) {
    alert("error occurred while registration");
    console.log(error);
    throw new Error(error.message);
  }
};

// for login
export const login = async (userData) => {
  try {
    const response = await axios.post(`${rootUrl}/api/user/login`, userData);

    localStorage.setItem("userInfo", JSON.stringify(response.data));
    return response;
  } catch (error) {
    alert("error occurred while login");
    console.log(error);
    throw new Error(error.message);
  }
};
