import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ConfirmPopupProvider } from '../../context/ConfirmPopupContext';
import useErrorHandler from '../../hooks/useErrorHandler';
import { loadCart, loadLikes } from '../../services/slices/appSlice';
import { setItems } from '../../services/slices/itemSlice';
import { login } from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { ApiCheckAuth, ApiGetItems } from '../../utils/api';
import { ROLES } from '../../utils/types';
import Admin from '../Admin/Admin';
import AuthPopup from '../AuthPopup/AuthPopup';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
import CartPage from '../CartPage/CartPage';
import ConfirmPopup from '../ConfirmPopup/ConfirmPopup';
import FindPage from '../FindPage/FindPage';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import ItemPage from '../ItemPage/ItemPage';
import LikesPage from '../LikesPage/LikesPage';
import Main from '../Main/Main';
import Profile from '../Profile/Profile';
import { ProtectedRoute } from '../ProtectedRoute/ProtectedRoute';
import SnackBar from '../SnackBar/SnackBar';
import './App.scss';

function App() {
  const { isAuthPopupOpened } = useSelector((state) => state.authPopupSlice);
  const { handleError } = useErrorHandler();
  const { isOpen: isSnackBarOpened } = useSelector(
    (state) => state.appSlice.snackBar,
  );

  const dispatch = useDispatch();

  useEffect(() => {
    ApiCheckAuth().then((user) => dispatch(login(user)));
    ApiGetItems()
      .then((items) => dispatch(setItems(items)))
      .catch(handleError);

    const cartItems = localStorage.getItem('cart');
    const likesItems = localStorage.getItem('likes');
    if (cartItems) {
      dispatch(loadCart(JSON.parse(cartItems)));
    }
    if (likesItems) {
      dispatch(loadLikes(JSON.parse(likesItems)));
    }
  }, []);

  return (
    <ConfirmPopupProvider>
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
        <Route path="/items/:id" element={<ItemPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/find" element={<FindPage />} />
        <Route path="/likes" element={<LikesPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
      <Footer />
      {isAuthPopupOpened && <AuthPopup />}
      {isSnackBarOpened && <SnackBar />}
      <BurgerMenu />
      <ConfirmPopup />
    </ConfirmPopupProvider>
  );
}

export default App;
