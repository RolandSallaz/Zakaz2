import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import AuthPopup from '../AuthPopup/AuthPopup';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Main from '../Main/Main';
import SnackBar from '../SnackBar/SnackBar';
import './App.scss';
import { ApiCheckAuth } from '../../utils/api';
import { login } from '../../services/slices/userSlice';

function App() {
  const { isAuthPopupOpened } = useSelector((state) => state.authPopupSlice);
  const { isOpen: isSnackBarOpened } = useSelector(
    (state) => state.appSlice.snackBar,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    ApiCheckAuth().then((res) => dispatch(login(res)));
  }, []);

  return (
    <>
      <Header />
      <Main />
      <Footer />
      {isAuthPopupOpened && <AuthPopup />}
      {isSnackBarOpened && <SnackBar />}
    </>
  );
}

export default App;
