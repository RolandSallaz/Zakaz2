import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IConfirmPopup, ISnackBar } from '../../utils/types';

interface IAppState {
  snackBar: ISnackBar;
  confirmPopup: IConfirmPopup;
}

const initialState: IAppState = {
  snackBar: { isOpen: false, text: '', hasError: false },
  confirmPopup: { isOpen: false, cb: () => null },
};

export const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    openSnackBar(state, action: PayloadAction<ISnackBar>) {
      state.snackBar = { ...action.payload, isOpen: true };
    },
    closeSnackBar(state) {
      state.snackBar = initialState.snackBar;
    },
    openConfirmPopup(state, action: PayloadAction<IConfirmPopup['cb']>) {
      state.confirmPopup = { cb: action.payload, isOpen: true };
    },
    closeConfirmPopup(state) {
      state.confirmPopup = initialState.confirmPopup;
    },
  },
});
export const {
  openSnackBar,
  closeSnackBar,
  openConfirmPopup,
  closeConfirmPopup,
} = slice.actions;

export default slice.reducer;
