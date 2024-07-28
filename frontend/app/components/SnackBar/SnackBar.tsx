import { useEffect } from "react";
import "./SnackBar.scss";
import { closeSnackBar } from "../../lib/redux/slices/appSlice";
import { useAppSelector, useAppDispatch } from "@/app/lib/redux/store";

export default function SnackBar() {
  const { text, hasError } = useAppSelector((state) => state.appSlice.snackBar);
  const closeTimer = 3000; //3 sec
  const dispatch = useAppDispatch();

  function handleClose() {
    dispatch(closeSnackBar());
  }

  useEffect(() => {
    setTimeout(handleClose, closeTimer);
  }, []);

  return (
    <div
      onClick={handleClose}
      className={`SnackBar ${hasError && "SnackBar_error"}`}
    >
      {text}
    </div>
  );
}
