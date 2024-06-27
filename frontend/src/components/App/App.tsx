import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import AuthPopup from '../AuthPopup/AuthPopup';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Main from '../Main/Main';
import SnackBar from '../SnackBar/SnackBar';
import './App.scss';
import { ApiCheckAuth, ApiGetItems } from '../../utils/api';
import { login } from '../../services/slices/userSlice';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute/ProtectedRoute';
import Admin from '../Admin/Admin';
import { ROLES } from '../../utils/types';
import useErrorHandler from '../../hooks/useErrorHandler';
import { setItems } from '../../services/slices/itemSlice';
import ItemPage from '../ItemPage/ItemPage';
import ConfirmPopup from '../ConfirmPopup/ConfirmPopup';

function App() {
  const { isAuthPopupOpened } = useSelector((state) => state.authPopupSlice);
  const { handleError } = useErrorHandler();
  const { isOpen: isSnackBarOpened } = useSelector(
    (state) => state.appSlice.snackBar,
  );
  const { isOpen: isConfirmPopupOpened } = useSelector(
    (state) => state.appSlice.confirmPopup,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    ApiCheckAuth().then((user) => dispatch(login(user)));
    ApiGetItems()
      .then((items) => dispatch(setItems(items)))
      .catch(handleError);
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
        <Route path="/items/*" element={<ItemPage />} />
      </Routes>
      <Footer />
      {isAuthPopupOpened && <AuthPopup />}
      {isSnackBarOpened && <SnackBar />}
      {isConfirmPopupOpened && <ConfirmPopup />}
    </>
  );
}

export default App;
