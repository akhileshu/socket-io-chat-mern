import axios from "axios";
import { rootUrl } from "../../constants";

// in some case it does work ex when ls userInfo changes / its null etc
// Set the default Authorization header for all Axios requests
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo?.token}`;

// Now, every Axios request will include the Authorization header with the Bearer token.

// for searchUser
export const searchUser = async (searchText) => {
  try {
    const params = {
      search: searchText,
    };
    const response = await axios.get(`${rootUrl}/api/user`, { params });
    return response;
  } catch (error) {
    alert("error occurred while searching user");
    console.log(error);
    throw new Error(error.message);
  }
};
// for accessChat
export const accessChat = async (chatPartnerId) => {
  try {
    const response = await axios.post(`${rootUrl}/api/chat`, {
      chatPartnerId,
    });
    return response;
  } catch (error) {
    alert("error occurred while accessing Chat With User");
    console.log(error);
    throw new Error(error.message);
  }
};
// for fetchChats
export const fetchChats = async () => {
  try {
    // Retrieve the Bearer token from your authentication system
    const authToken = `Bearer ${
      JSON.parse(localStorage.getItem("userInfo"))?.token
    }`; // Replace with your actual token

    const response = await axios.get(`${rootUrl}/api/chat`, {
      headers: {
        Authorization: authToken,
      },
    });

    return response;
  } catch (error) {
    alert("An error occurred while fetching all Chats");
    console.error(error);
    throw new Error(error.message);
  }
};
// for createGrpChat
export const createGrpChat = async (data) => {
  try {
    const authToken = `Bearer ${
      JSON.parse(localStorage.getItem("userInfo"))?.token
    }`;

    const response = await axios.post(`${rootUrl}/api/chat/create-grp`, data, {
      headers: {
        Authorization: authToken,
      },
    });

    return response;
  } catch (error) {
    alert("An error occurred while creating group");
    console.error(error);
    throw new Error(error.message);
  }
};
// for changeGrpName
export const changeGrpName = async (details) => {
  try {
    const authToken = `Bearer ${
      JSON.parse(localStorage.getItem("userInfo"))?.token
    }`;

    const response = await axios.patch(
      `${rootUrl}/api/chat/rename-grp`,
      details,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response;
  } catch (error) {
    alert("An error occurred while creating group");
    console.error(error);
    throw new Error(error.message);
  }
};
// for removeUserFromGrp
export const removeUserFromGrp = async (details) => {
  try {
    const authToken = `Bearer ${
      JSON.parse(localStorage.getItem("userInfo"))?.token
    }`;

    const response = await axios.patch(
      `${rootUrl}/api/chat/remove-from-grp`,
      details,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response;
  } catch (error) {
    alert("An error occurred while creating group");
    console.error(error);
    throw new Error(error.message);
  }
};
// for addUserToGrp
export const addUserToGrp = async (details) => {
  try {
    const authToken = `Bearer ${
      JSON.parse(localStorage.getItem("userInfo"))?.token
    }`;

    const response = await axios.patch(
      `${rootUrl}/api/chat/add-to-grp`,
      details,
      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response;
  } catch (error) {
    alert("An error occurred while creating group");
    console.error(error);
    throw new Error(error.message);
  }
};
// for sendNewMessage
export const sendNewMessage = async (details) => {
  try {
    const authToken = `Bearer ${
      JSON.parse(localStorage.getItem("userInfo"))?.token
    }`;

    const response = await axios.post(`${rootUrl}/api/message`, details, {
      headers: {
        Authorization: authToken,
      },
    });

    return response;
  } catch (error) {
    alert("An error occurred while creating group");
    console.error(error);
    throw new Error(error.message);
  }
};
// for fetchMessages
export const fetchMessages = async (chatId) => {
  try {
    const authToken = `Bearer ${
      JSON.parse(localStorage.getItem("userInfo"))?.token
    }`;

    const response = await axios.get(
      `${rootUrl}/api/message/${chatId}`,

      {
        headers: {
          Authorization: authToken,
        },
      }
    );

    return response;
  } catch (error) {
    alert("An error occurred while fetching messages for this chat");
    console.error(error);
    throw new Error(error.message);
  }
};
// for AddNotification
export const AddNotification = async (details) => {
  try {
    const authToken = `Bearer ${
      JSON.parse(localStorage.getItem("userInfo"))?.token
    }`;

    const response = await axios.post(
      `${rootUrl}/api/notification`,
      details,

      {
        headers: {
          Authorization: authToken,
        },
      }
    );
    console.error(response);
    return response;
  } catch (error) {
    // console.log(error)
    // alert("An error occurred while adding notifications");
    console.error(error);
    throw new Error(error.message);
  }
};
