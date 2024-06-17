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
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute/ProtectedRoute';
import Admin from '../Admin/Admin';
import { ROLES } from '../../utils/types';

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
      <Routes>
        <Route path="/" element={<Main />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredLevel={ROLES.MANAGER}>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
      {isAuthPopupOpened && <AuthPopup />}
      {isSnackBarOpened && <SnackBar />}
    </>
  );
}

export default App;
