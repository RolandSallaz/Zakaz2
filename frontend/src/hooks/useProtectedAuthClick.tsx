import { useNavigate } from 'react-router-dom';
import { openAuthPopup } from '../services/slices/authPopupSlice';
import { useDispatch, useSelector } from '../services/store';

export default function useProtectedAuthClick() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.userSlice);
  const navigate = useNavigate();
  function handleClick(action: () => void) {
    if (isLoggedIn) {
      action();
    } else {
      navigate('/');
      dispatch(openAuthPopup());
    }
  }
  return { handleClick };
}
