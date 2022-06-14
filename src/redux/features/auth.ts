import { AxiosError } from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { User } from "../../@types";
import AuthService from "../../services/auth.service";

const userJWT = localStorage.getItem("userJWT");

let user: User | null = null;
if (userJWT) {
  user = JSON.parse(userJWT);
}

export const login = createAsyncThunk(
  "auth/log-in",
  async (values: { username: string; password: string }, thunkApi) => {
    try {
      const data = await AuthService.login(values.username, values.password);
      console.log(data);
      return { user: data };
    } catch (error) {
      return thunkApi.rejectWithValue("");
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    values: { username: string; password: string; role: string },
    thunkApi
  ) => {
    try {
      const { data } = await AuthService.register(
        values.username,
        values.password,
        values.role
      );
      return data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return thunkApi.rejectWithValue(error.response?.data);
      }
    }
  }
);

export const logout = () => {
  AuthService.logout();
};

const initialState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

export const loginSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout,
  },
  extraReducers(builder) {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggedIn = false;
        state.user = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoggedIn = false;
      })
      .addCase(register.rejected, (state) => {
        state.isLoggedIn = false;
      });
  },
});

export default loginSlice.reducer;
