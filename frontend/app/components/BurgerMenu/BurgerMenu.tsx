import Link from "next/link";
import { setIsBurgerMenuOpened } from "../../lib/redux/slices/appSlice";
import { useAppDispatch, useAppSelector } from "../../lib/redux/store";
import "./BurgerMenu.scss";

export default function BurgerMenu() {
  const { isBurgerMenuOpened } = useAppSelector((state) => state.appSlice);
  const dispatch = useAppDispatch();

  function handleClose() {
    dispatch(setIsBurgerMenuOpened(false));
  }

  function handleBackgroundClick() {
    handleClose();
  }
  return (
    <nav
      className={`BurgerMenu ${isBurgerMenuOpened && "BurgerMenu_opened"}`}
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
            href="/find"
          >
            Найти товар
          </Link>
        </div>
        <Link
          className="BurgerMenu__button"
          href={`/find?${new URLSearchParams({ gender: "male" }).toString()}`}
        >
          Для него
        </Link>
        <Link
          className="BurgerMenu__button"
          href={`/find?${new URLSearchParams({ gender: "female" }).toString()}`}
        >
          Для неё
        </Link>
        <Link className="BurgerMenu__button" href="/profile">
          Мой аккаунт
        </Link>
        <Link className="BurgerMenu__button" href="/about/order">
          Оформление заказа
        </Link>
        <Link className="BurgerMenu__button" href="/likes">
          Избранное
        </Link>
        <Link className="BurgerMenu__button" href="/about/customer-help">
          Помощь покупателю
        </Link>
        <Link className="BurgerMenu__button" href="/about/order">
          Оформление заказа
        </Link>
        <Link className="BurgerMenu__button" href="/about/measurements">
          Замеры
        </Link>
        <Link className="BurgerMenu__button" href="/about/delivery">
          Доставка
        </Link>
        <a
          className="BurgerMenu__button"
          target="_blank"
          href="https://t.me/blinkresale_reviews"
        >
          Отзывы
        </a>
      </div>
    </nav>
  );
}
