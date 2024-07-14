import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { ISnackBar } from '../../utils/types';

interface ILikeOrCart {
  id: number;
  addedDate: Date;
}

interface IAppState {
  snackBar: ISnackBar;
  isBurgerMenuOpened: boolean;
  cart: ILikeOrCart[];
  likes: ILikeOrCart[];
}

const initialState: IAppState = {
  snackBar: { isOpen: false, text: '', hasError: false },
  isBurgerMenuOpened: false,
  cart: [],
  likes: [],
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
    addLikes(state, action: PayloadAction<number>) {
      const like: ILikeOrCart = {
        id: action.payload,
        addedDate: new Date(),
      };
      state.likes = [...state.likes, like];
      localStorage.setItem('likes', JSON.stringify(state.likes));
    },
    removeFromLikes(state, action: PayloadAction<number>) {
      state.likes = state.likes.filter(
        (itemId: ILikeOrCart) => itemId.id !== action.payload,
      );
      localStorage.setItem('likes', JSON.stringify(state.likes));
    },
    loadLikes(state, action: PayloadAction<ILikeOrCart[]>) {
      state.likes = action.payload;
    },
    addToCart(state, action: PayloadAction<number>) {
      const cartItem: ILikeOrCart = {
        id: action.payload,
        addedDate: new Date(),
      };
      state.cart = [...state.cart, cartItem];
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.cart = state.cart.filter((item) => item.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.cart));
    },
    loadCart(state, action: PayloadAction<ILikeOrCart[]>) {
      state.cart = action.payload;
    },
  },
});
export const {
  openSnackBar,
  closeSnackBar,
  setIsBurgerMenuOpened,
  addLikes,
  addToCart,
  loadCart,
  loadLikes,
  removeFromCart,
  removeFromLikes,
} = slice.actions;

export default slice.reducer;
