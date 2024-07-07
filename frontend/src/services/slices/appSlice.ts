import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ISnackBar } from '../../utils/types';

interface IAppState {
  snackBar: ISnackBar;
  isBurgerMenuOpened: boolean;
}

const initialState: IAppState = {
  snackBar: { isOpen: false, text: '', hasError: false },
  isBurgerMenuOpened: false,
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
    setIsBurgerMenuOpened(state, action: PayloadAction<boolean>) {
      state.isBurgerMenuOpened = action.payload;
    },
  },
});
export const { openSnackBar, closeSnackBar, setIsBurgerMenuOpened } =
  slice.actions;

export default slice.reducer;
