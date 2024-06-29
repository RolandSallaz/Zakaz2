import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ISnackBar } from '../../utils/types';

interface IAppState {
  snackBar: ISnackBar;
}

const initialState: IAppState = {
  snackBar: { isOpen: false, text: '', hasError: false },
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
  },
});
export const { openSnackBar, closeSnackBar } = slice.actions;

export default slice.reducer;
