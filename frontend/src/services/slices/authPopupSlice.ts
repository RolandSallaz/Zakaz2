import { createSlice } from '@reduxjs/toolkit';

interface IAppState {
  isAuthPopupOpened: boolean;
  loading: boolean;
}

const initialState: IAppState = {
  loading: false,
  isAuthPopupOpened: false,
};

export const slice = createSlice({
  name: 'authPopup',
  initialState,
  reducers: {
    openAuthPopup(state) {
      state.isAuthPopupOpened = true;
    },
    closeAuthPopup(state) {
      state.isAuthPopupOpened = initialState.isAuthPopupOpened;
    },
  },
});
export const { openAuthPopup, closeAuthPopup } = slice.actions;

export default slice.reducer;
