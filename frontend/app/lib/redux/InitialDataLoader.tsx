"use client";
import { useEffect } from "react";
import AuthPopup from "../../components/AuthPopup/AuthPopup";
import BurgerMenu from "../../components/BurgerMenu/BurgerMenu";
import ConfirmPopup from "../../components/ConfirmPopup/ConfirmPopup";
import InfoPopup from "../../components/InfoPopup/InfoPopup";
import SnackBar from "../../components/SnackBar/SnackBar";
import useErrorHandler from "../hooks/useErrorHandler";
import { ApiCheckAuth, ApiGetInfo } from "../utils/api";
import { loadCart, loadLikes, setMainHeading } from "./slices/appSlice";
import { login } from "./slices/userSlice";
import { useAppDispatch, useAppSelector } from "./store";
import TreeListMobile from "@/app/components/TreeList/TreeListMobile";

export default function InitialDataLoader() {
  const { handleError } = useErrorHandler();
  const dispatch = useAppDispatch();
  const { isAuthPopupOpened } = useAppSelector((state) => state.authPopupSlice);
  const { isPopupOpened: isSearchCategoryPopupOpened } = useAppSelector(state => state.searchCategorySlice);
  const { isOpen: isSnackBarOpened } = useAppSelector(
    (state) => state.appSlice.snackBar
  );
  const {
    infoPopup: { isOpened: isInfoPopupOpened },
  } = useAppSelector((state) => state.appSlice);
  useEffect(() => {
    ApiCheckAuth().then((user) => dispatch(login(user))).catch(console.log);

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
    ).catch(console.log);

  }, []);

  return (
    <>
      {isAuthPopupOpened && <AuthPopup />}
      {isSnackBarOpened && <SnackBar />}
      {isInfoPopupOpened && <InfoPopup />}
      {isSearchCategoryPopupOpened && <TreeListMobile />}
      <BurgerMenu />
      <ConfirmPopup />
    </>
  );
}
