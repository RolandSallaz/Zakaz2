import { combineReducers, configureStore } from '@reduxjs/toolkit';
import appSlice from './slices/appSlice';
import authPopupSlice from './slices/authPopupSlice';
import userSlice from './slices/userSlice';
import itemSlice from './slices/itemSlice';

export const rootReducer = combineReducers({
  appSlice,
  authPopupSlice,
  userSlice,
  itemSlice,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
