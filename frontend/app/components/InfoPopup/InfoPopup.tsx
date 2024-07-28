import { MouseEvent, useEffect, useState } from "react";
import { closeInfoPopup } from "../../lib/redux/slices/appSlice";

import "./InfoPopup.scss";
import { useAppSelector, useAppDispatch } from "@/app/lib/redux/store";

export default function InfoPopup() {
  const {
    infoPopup: { text },
  } = useAppSelector((state) => state.appSlice);
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  function handleClose() {
    setIsOpen(false);
    setTimeout(() => {
      dispatch(closeInfoPopup());
    }, 500); // Задержка перед закрытием попапа
  }

  function handleBackgroundClick(e: MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }

  useEffect(() => {
    const interval = setTimeout(handleClose, 5000);
    return () => clearTimeout(interval);
  }, []);

  return (
    <div
      className={`InfoPopup InfoPopup_${isOpen}`}
      onClick={handleBackgroundClick}
    >
      <div className="InfoPopup__container">
        <h2 className="InfoPopup__text">{text}</h2>
      </div>
    </div>
  );
}
