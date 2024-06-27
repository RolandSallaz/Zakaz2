import { closeConfirmPopup } from '../../services/slices/appSlice';
import { useDispatch, useSelector } from '../../services/store';
import './ConfirmPopup.scss';
export default function ConfirmPopup() {
  const dispatch = useDispatch();
  const { cb } = useSelector((state) => state.appSlice.confirmPopup);

  function handleClose() {
    dispatch(closeConfirmPopup());
  }

  function handleConfirm() {
    cb();
    dispatch(closeConfirmPopup());
  }

  return (
    <div className="ConfirmPopup">
      <div className="ConfirmPopup__container">
        <h2 className="ConfirmPopup__heading">Вы уверены?</h2>
        <div className="ConfirmPopup__sub-container">
          <button className="ConfirmPopup__button" onClick={handleConfirm}>
            Да
          </button>
          <button className="ConfirmPopup__button" onClick={handleClose}>
            Нет
          </button>
        </div>
      </div>
    </div>
  );
}
