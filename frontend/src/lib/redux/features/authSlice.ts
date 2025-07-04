import { IAuth } from "@/interfaces/auth.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IAuth = {
  user: {
    id: 0,
    email: "",
    username: "",
    role: "",
    image: "",
  },
  isLogin: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    onLogin: (state: IAuth, action: PayloadAction<IAuth>) => {
      state.user.id = action.payload.user.id;
      state.user.email = action.payload.user.email;
      state.user.username = action.payload.user.username;
      state.user.role = action.payload.user.role;
      state.isLogin = true;
    },
    onLogout: (state: IAuth) => {
      state.user.id = 0;
      state.user.email = "";
      state.user.username = "";
      state.user.role = "";
      state.isLogin = true;
    },
  },
});

export const { onLogin, onLogout } = authSlice.actions;

export default authSlice.reducer;
