import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  AddNotification,
  accessChat,
  addUserToGrp,
  changeGrpName,
  createGrpChat,
  fetchChats,
  fetchMessages,
  removeUserFromGrp,
  searchUser,
  sendNewMessage,
} from "./chatAPI";

const initialState = {
  status: "idle",
  error: null,
  searchedUsersList: [],
  activeChat: null,
  chats: [],
  chatSwitched: false,
  messages: [],
  notifications: [],
};

export const searchUserAsync = createAsyncThunk(
  "chat/searchUser",
  async (searchText, { rejectWithValue }) => {
    try {
      const response = await searchUser(searchText);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message); //calls in .rejected
    }
  }
);
export const accessChatAsync = createAsyncThunk(
  "chat/accessChat",
  //  reminder:this will fetch if already a chat exists or will create one
  async (chatPartnerId, { rejectWithValue }) => {
    try {
      const response = await accessChat(chatPartnerId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message); //calls in .rejected
    }
  }
);
export const fetchChatsAsync = createAsyncThunk(
  "chat/fetchChats",
  // The underscore _ in the parameters of an async thunk action creator is often used as a convention to indicate that the parameter is not being used or is not relevant in this particular action creator.
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchChats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message); //calls in .rejected
    }
  }
);
export const createGrpChatAsync = createAsyncThunk(
  "chat/createGrpChat",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createGrpChat(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message); //calls in .rejected
    }
  }
);
export const changeGrpNameAsync = createAsyncThunk(
  "chat/changeGrpName",
  async (details, { rejectWithValue }) => {
    try {
      const response = await changeGrpName(details);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message); //calls in .rejected
    }
  }
);
export const removeUserFromGrpAsync = createAsyncThunk(
  "chat/removeUserFromGrp",
  async (details, { rejectWithValue }) => {
    try {
      const response = await removeUserFromGrp(details);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message); //calls in .rejected
    }
  }
);
export const exitFromGrpAsync = createAsyncThunk(
  "chat/exitFromGrp",
  async (details, { rejectWithValue }) => {
    try {
      const response = await removeUserFromGrp(details);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message); //calls in .rejected
    }
  }
);
export const addUserToGrpAsync = createAsyncThunk(
  "chat/addUserToGrp",
  async (details, { rejectWithValue }) => {
    try {
      const response = await addUserToGrp(details);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message); //calls in .rejected
    }
  }
);
export const sendNewMessageAsync = createAsyncThunk(
  "chat/sendNewMessage",
  async (details, { rejectWithValue }) => {
    try {
      const response = await sendNewMessage(details);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message); //calls in .rejected
    }
  }
);
// fetch all messages for a particular chat
export const fetchMessagesAsync = createAsyncThunk(
  "chat/fetchMessages",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await fetchMessages(chatId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message); //calls in .rejected
    }
  }
);
export const AddNotificationAsync = createAsyncThunk(
  "chat/AddNotification",
  async (details, { rejectWithValue }) => {
    try {
      const response = await AddNotification(details);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message); //calls in .rejected
    }
  }
);

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    updateChats: (state, action) => {
      state.chats = action.payload;
    },
    updateChatSwitched: (state) => {
      state.chatSwitched = !state.chatSwitched;
    },
    updateSearchedUsersList: (state, action) => {
      state.searchedUsersList = action.payload;
    },
    updateMessages: (state, action) => {
      state.messages = action.payload;
    },
    updateNotifications: (state, action) => {
      state.notifications = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // searchUser
      .addCase(searchUserAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchUserAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.searchedUsersList = action.payload;
      })
      .addCase(searchUserAsync.rejected, (state, action) => {
        state.status = "idle";
        state.searchedUsersList = null;
        state.error = action.payload;
      })
      // accessChat
      .addCase(accessChatAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(accessChatAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.activeChat = action.payload;

        // Use the Array.findIndex method to check if the chat already exists
        const chatIndex = state.chats.findIndex(
          (chat) => chat?._id === action.payload._id
        );

        if (chatIndex === -1) {
          // Chat with the given ID does not exist in the state, so add it
          console.log(action.payload);
          // state.chats.push(action.payload);
          // to put latest chat on top
          state.chats.unshift(action.payload);
        } else {
          // Chat with the given ID already exists, you can update it if needed
          // state.chats[chatIndex] = action.payload;
        }
      })

      .addCase(accessChatAsync.rejected, (state, action) => {
        state.status = "idle";
        state.activeChat = null;
        state.error = action.payload;
      })
      // fetchChatsAsync
      .addCase(fetchChatsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchChatsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.chats = action.payload;
      })
      .addCase(fetchChatsAsync.rejected, (state, action) => {
        state.status = "idle";
        state.chats = null;
        state.error = action.payload;
      })
      // createGrpChatAsync
      .addCase(createGrpChatAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createGrpChatAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.chats.unshift(action.payload);
      })
      .addCase(createGrpChatAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      // changeGrpNameAsync
      .addCase(changeGrpNameAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(changeGrpNameAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.chats = state.chats.map((chat) =>
          chat._id === action.payload._id ? action.payload : chat
        );
        state.activeChat = action.payload;
      })
      .addCase(changeGrpNameAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      // removeUserFromGrpAsync
      .addCase(removeUserFromGrpAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeUserFromGrpAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.chats = state.chats.map((chat) =>
          chat._id === action.payload._id ? action.payload : chat
        );
        state.activeChat = action.payload;
      })
      .addCase(removeUserFromGrpAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      // addUserToGrpAsync
      .addCase(addUserToGrpAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addUserToGrpAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.chats = state.chats.map((chat) =>
          chat._id === action.payload._id ? action.payload : chat
        );
        state.activeChat = action.payload;
      })
      .addCase(addUserToGrpAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      // exitFromGrpAsync
      .addCase(exitFromGrpAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(exitFromGrpAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.chats = state.chats.filter(
          (chat) => chat._id !== action.payload._id
        );
        state.activeChat = null;
      })
      .addCase(exitFromGrpAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      // sendNewMessageAsync
      .addCase(sendNewMessageAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendNewMessageAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.messages.push(action.payload);
      })
      .addCase(sendNewMessageAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
      })
      // fetchMessagesAsync
      .addCase(fetchMessagesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMessagesAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.messages = action.payload;
      })
      .addCase(fetchMessagesAsync.rejected, (state, action) => {
        state.status = "idle";
        state.error = action.payload;
        state.messages = [];
      });
  },
});

export const {
  updateActiveChat,
  updateChats,
  updateMessages,
  updateChatSwitched,
  updateSearchedUsersList,
  updateNotifications,
} = chatSlice.actions;

// export const selectCount = (state) => state.chat.value;
export const selectChatState = (state) => state.chat;

export default chatSlice.reducer;
