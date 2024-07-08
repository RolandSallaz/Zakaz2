import { Link } from 'react-router-dom';
import { setIsBurgerMenuOpened } from '../../services/slices/appSlice';
import { useDispatch, useSelector } from '../../services/store';
import './BurgerMenu.scss';
import { MouseEvent } from 'react';

export default function BurgerMenu() {
  const { isBurgerMenuOpened } = useSelector((state) => state.appSlice);
  const dispatch = useDispatch();

  function handleClose() {
    dispatch(setIsBurgerMenuOpened(false));
  }

  function handleBackgroundClick(e: MouseEvent<HTMLDivElement>) {
    if (e.target == e.currentTarget) {
      handleClose();
    }
  }
  return (
    <nav
      className={`BurgerMenu ${isBurgerMenuOpened && 'BurgerMenu_opened'}`}
      onClick={handleBackgroundClick}
    >
      <div className="BurgerMenu__content">
        <div className="BurgerMenu__top-buttons">
          <button className="BurgerMenu__button" onClick={handleClose}>
            <svg fill="none" viewBox="0 0 24 24" height="1em" width="1em">
              <path
                fill="currentColor"
                d="M6.225 4.811a1 1 0 00-1.414 1.414L10.586 12 4.81 17.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.81z"
              />
            </svg>
          </button>
          <Link
            className="BurgerMenu__button BurgerMenu__button_search"
            to="/find"
          >
            Найти товар
          </Link>
        </div>
        <button className="BurgerMenu__button">Для него</button>
        <button className="BurgerMenu__button">Для неё</button>
        <button className="BurgerMenu__button">Как оформить возврат</button>
        <button className="BurgerMenu__button">Замеры</button>
        <button className="BurgerMenu__button">Доставка, оплата</button>
        <button className="BurgerMenu__button">Контакты</button>
        <button className="BurgerMenu__button">Отзывы</button>
        <button className="BurgerMenu__button">О нас</button>
        <button className="BurgerMenu__button">Фотоотчет</button>
        <button className="BurgerMenu__button">Статьи</button>
      </div>
    </nav>
  );
}