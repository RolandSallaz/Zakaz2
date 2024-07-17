import { MouseEvent, useEffect, useState } from 'react';
import { closeInfoPopup } from '../../services/slices/appSlice';
import { useDispatch, useSelector } from '../../services/store';
import './InfoPopup.scss';

export default function InfoPopup() {
  const {
    infoPopup: { text },
  } = useSelector((state) => state.appSlice);
  const dispatch = useDispatch();
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
