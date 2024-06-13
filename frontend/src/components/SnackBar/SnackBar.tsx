import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import './SnackBar.scss';
import { closeSnackBar } from '../../services/slices/appSlice';

export default function SnackBar() {
  const { text, hasError } = useSelector((state) => state.appSlice.snackBar);
  const closeTimer = 3000; //3 sec
  const dispatch = useDispatch();

  function handleClose() {
    dispatch(closeSnackBar());
  }

  useEffect(() => {
    setTimeout(handleClose, closeTimer);
  }, []);

  return (
    <div
      onClick={handleClose}
      className={`SnackBar ${hasError && 'SnackBar_error'}`}
    >
      {text}
    </div>
  );
}
