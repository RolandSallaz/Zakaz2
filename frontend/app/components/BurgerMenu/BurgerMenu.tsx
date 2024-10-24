import Link from "next/link";
import { debounce } from 'lodash';
import { setIsBurgerMenuOpened } from "../../lib/redux/slices/appSlice";
import { useAppDispatch, useAppSelector } from "../../lib/redux/store";
import "./BurgerMenu.scss";
import { ChangeEvent, MouseEvent, useCallback, useState } from "react";
import { ApiGetItemsByName } from "@/app/lib/utils/api";
import useErrorHandler from "@/app/lib/hooks/useErrorHandler";
import { IItem } from "@/app/lib/utils/types";

export default function BurgerMenu() {
  const { isBurgerMenuOpened } = useAppSelector((state) => state.appSlice);
  const [searchedItems, setSearchedItems] = useState<IItem[]>([]);
  const dispatch = useAppDispatch();
  const { handleError } = useErrorHandler();

  function handleChangeSearch(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    debouncedSearch(value);
  }

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      if (value.length > 2) {
        ApiGetItemsByName(value).then(setSearchedItems).catch(handleError);
      }
      else {
        setSearchedItems([]);
      }
    }, 500),
    []
  );

  function handleClose() {
    dispatch(setIsBurgerMenuOpened(false));
  }

  function handleBackgroundClick(e: MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;

    if (target.classList.contains('burger-search__input')) {
      return;
    }
    handleClose();
  }
  return (
    <nav
      className={`BurgerMenu ${isBurgerMenuOpened && "BurgerMenu_opened"}`}
      onClick={handleBackgroundClick}
    >
      <div className="BurgerMenu__content">
        <div className="BurgerMenu__top-buttons">
          <Link href={'/'} className="BurgerMenu__heading">BLINKRESALE</Link>
          <button className="BurgerMenu__button BurgerMenu__button_close" onClick={handleClose}>
            <svg fill="none" viewBox="0 0 24 24" height="1em" width="1em">
              <path
                fill="currentColor"
                d="M6.225 4.811a1 1 0 00-1.414 1.414L10.586 12 4.81 17.775a1 1 0 101.414 1.414L12 13.414l5.775 5.775a1 1 0 001.414-1.414L13.414 12l5.775-5.775a1 1 0 00-1.414-1.414L12 10.586 6.225 4.81z"
              />
            </svg>
          </button>
        </div>
        <div className="BurgerMenu__bottom-container">
          <div className="burger-search">
            <Link className="burger-search__button" href={'find'}>
              <svg
                viewBox="0 0 1024 1024"
                fill="currentColor"
                height="1em"
                width="1em"
              >
                <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" />
              </svg>
            </Link>
            <input
              className="burger-search__input"
              placeholder="Поиск товаров..."
              onChange={handleChangeSearch}
            />
            {searchedItems.length > 0 && (
              <ul className="burger-search__items-list">
                {searchedItems.map(item => (<li key={item.id}><Link href={`items/${item.id}`}>{item.name}</Link></li>))}
              </ul>
            )}
          </div>
          <Link
            className="BurgerMenu__button"
            href={`/find?${new URLSearchParams({ gender: "female" }).toString()}`}
          >
            Женское
          </Link>
          <Link
            className="BurgerMenu__button"
            href={`/find?${new URLSearchParams({ gender: "male" }).toString()}`}
          >
            Мужское
          </Link>
          <Link className="BurgerMenu__button" href="/profile">
            Личный кабинет
          </Link>
          <Link className="BurgerMenu__button" href="/likes">
            Избранное
          </Link>
          <Link className="BurgerMenu__button" href="/about/customer-help">
            Процесс заказа
          </Link>
          <Link className="BurgerMenu__button" href="/about/order">
            Оформление заказа
          </Link>
          <Link className="BurgerMenu__button" href="/about/measurements">
            Как сделать замер
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
      </div>
    </nav>
  );
}
