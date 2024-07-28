import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../utils/types";

interface IAppState {
  isLoggedIn: boolean;
  userData: IUser;
}

const initialState: IAppState = {
  isLoggedIn: false,
  userData: {
    email: "null",
    id: 0,
    auth_level: 0,
    register_date: new Date().toISOString(),
    createdItems: [],
  },
};

export const slice = createSlice({
  name: "authPopup",
  initialState,
  reducers: {
    login(state, action: PayloadAction<IUser>) {
      state.isLoggedIn = true;
      state.userData = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userData = initialState.userData;
    },
  },
});
export const { login, logout } = slice.actions;

export default slice.reducer;
