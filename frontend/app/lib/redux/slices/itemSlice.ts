import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IItem } from "../../utils/types";

interface IAppState {
  data: IItem[];
}

const initialState: IAppState = {
  data: [],
};

export const slice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<IItem[]>) {
      state.data = action.payload;
    },
    addItem(state, action: PayloadAction<IItem>) {
      state.data = [...state.data, action.payload];
    },
  },
});
export const { setItems, addItem } = slice.actions;

export default slice.reducer;
