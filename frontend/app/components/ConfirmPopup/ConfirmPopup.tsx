import { MouseEvent } from "react";

import "./ConfirmPopup.scss";
import { useConfirmPopup } from "../context/ConfirmPopupContext";
export default function ConfirmPopup() {
  const { confirmPopup, confirm, closeConfirmPopup } = useConfirmPopup();

  if (!confirmPopup.isOpen) return null;

  function handleBackgroundClick(e: MouseEvent<HTMLDivElement>) {
    if (e.target == e.currentTarget) {
      closeConfirmPopup();
    }
  }

  return (
    <div className="ConfirmPopup" onClick={handleBackgroundClick}>
      <div className="ConfirmPopup__container">
        <h2 className="ConfirmPopup__heading">Вы уверены?</h2>
        <div className="ConfirmPopup__sub-container">
          <button className="ConfirmPopup__button" onClick={confirm}>
            Да
          </button>
          <button className="ConfirmPopup__button" onClick={closeConfirmPopup}>
            Нет
          </button>
        </div>
      </div>
    </div>
  );
}
