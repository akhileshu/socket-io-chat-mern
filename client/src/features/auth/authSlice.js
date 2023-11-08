import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, register } from "./authAPI";

const initialState = {
  userInfo: null,
  status: "idle",
  error: null,
};

export const registerAsync = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message); //calls in .rejected
    }
  }
);
export const loginAsync = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await login(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message); //calls in .rejected
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    updateUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
  
  extraReducers: (builder) => {
    builder
      // register
      .addCase(registerAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.userInfo = action.payload;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.status = "idle";
        state.userInfo = null;
        state.error = action.payload;
      })
      // login
      .addCase(loginAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.error = null;
        state.userInfo = action.payload;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = "idle";
        state.userInfo = null;
        state.error = action.payload;
      });
  },
});

export const { updateUserInfo } = authSlice.actions;

// export const selectCount = (state) => state.auth.value;
export const selectAuthState = (state) => state.auth;

export default authSlice.reducer;
