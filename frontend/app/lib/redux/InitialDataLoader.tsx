"use client";
import { useEffect } from "react";
import useErrorHandler from "../hooks/useErrorHandler";
import { ApiCheckAuth, ApiGetInfo, ApiGetItems } from "../utils/api";
import { loadCart, loadLikes, setMainHeading } from "./slices/appSlice";
import { setItems } from "./slices/itemSlice";
import { login } from "./slices/userSlice";
import { useAppDispatch, useAppSelector } from "./store";
import AuthPopup from "../../components/AuthPopup/AuthPopup";
import InfoPopup from "../../components/InfoPopup/InfoPopup";
import SnackBar from "../../components/SnackBar/SnackBar";
import BurgerMenu from "../../components/BurgerMenu/BurgerMenu";
import ConfirmPopup from "../../components/ConfirmPopup/ConfirmPopup";

export default function InitialDataLoader() {
  const { handleError } = useErrorHandler();
  const dispatch = useAppDispatch();
  const { isAuthPopupOpened } = useAppSelector((state) => state.authPopupSlice);
  const { isOpen: isSnackBarOpened } = useAppSelector(
    (state) => state.appSlice.snackBar
  );
  const {
    infoPopup: { isOpened: isInfoPopupOpened },
  } = useAppSelector((state) => state.appSlice);
  useEffect(() => {
    ApiCheckAuth().then((user) => dispatch(login(user)));
    ApiGetItems()
      .then((items) => dispatch(setItems(items)))
      .catch(handleError);

    const cartItems = localStorage.getItem("cart");
    const likesItems = localStorage.getItem("likes");
    if (cartItems) {
      dispatch(loadCart(JSON.parse(cartItems)));
    }
    if (likesItems) {
      dispatch(loadLikes(JSON.parse(likesItems)));
    }

    ApiGetInfo("heading_info").then((info) =>
      dispatch(setMainHeading(info.value))
    );
  }, []);
  return (
    <>
      {isAuthPopupOpened && <AuthPopup />}
      {isSnackBarOpened && <SnackBar />}
      {isInfoPopupOpened && <InfoPopup />}
      <BurgerMenu />
      <ConfirmPopup />
    </>
  );
}
