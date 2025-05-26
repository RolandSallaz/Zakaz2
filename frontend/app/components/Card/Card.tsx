import Link from "next/link";
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import SwiperCore from 'swiper';
import "swiper/css";
import 'swiper/css/pagination';
import { EffectCards, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import useHover from "../../lib/hooks/useHover";
import {
  addLikes,
  addToCart,
  removeFromCart,
  removeFromLikes,
} from "../../lib/redux/slices/appSlice";
import { useAppDispatch, useAppSelector } from "../../lib/redux/store";
import { IItem, TCardType } from "../../lib/utils/types";
import CheckBox from "../CheckBox/CheckBox";
import { selectTypes } from "../FindPage/FindPage";
import "./Card.scss";
import Image from "next/image";

interface props {
  item: IItem;
  type: TCardType;
  onCheckBoxChange?: (e: ChangeEvent<HTMLInputElement>, item: IItem) => void;
}

export default function Card({
  item,
  type = "default",
  onCheckBoxChange = () => null,
}: props) {
  const { cart, likes } = useAppSelector((state) => state.appSlice);
  const dispatch = useAppDispatch();
  const { isHovered, handleHovered } = useHover();
  const link = `/items/${item.id}`;
  const swiperRef = useRef<SwiperCore | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [slideInterval, setSlideInterval] = useState<NodeJS.Timeout | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function handleLikeClick(e: MouseEvent) {
    e.preventDefault();
    dispatch(addLikes(item.id));
  }

  function handleAddToCartClick(e: MouseEvent) {
    e.preventDefault();
    dispatch(addToCart(item.id));
  }

  function handleRemoveFromLikes(e: MouseEvent) {
    e.preventDefault();
    dispatch(removeFromLikes(item.id));
  }

  function handleRemoveFromCart(e: MouseEvent) {
    e.preventDefault();
    dispatch(removeFromCart(item.id));
  }

  function handleSelectChange(e: ChangeEvent<HTMLInputElement>) {
    onCheckBoxChange(e, item);
  }

  const isItemLiked: boolean = Boolean(
    likes.find((likeItem) => item.id == likeItem.id)
  );

  const isItemInCart: boolean = Boolean(
    cart.find((cartItem) => item.id == cartItem.id)
  );


  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let interval: NodeJS.Timeout;

    if (isHovered) {
      timeout = setTimeout(() => {
        interval = setInterval(() => {
          swiperRef.current?.slideNext();
        }, 1000);
        setSlideInterval(interval);
      }, 2000);
      setHoverTimeout(timeout);
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [isHovered]);

  const cardWithSlide = (
    <>
      <Link
        href={link}
        className={`card__container card__container_${type}`}
        onMouseEnter={handleHovered}
        onMouseLeave={handleHovered}
        id={item.id.toString()}
      >

        <button
          onClick={(e) =>
            isItemInCart ? handleRemoveFromCart(e) : handleAddToCartClick(e)
          }
          className={`card__button card__button_buy ${isHovered && "card__button_buy_hovered"
            }`}
        >
          {isItemInCart ? "Убрать из корзины" : "В корзину"}
        </button>
        <button
          onClick={(e) =>
            isItemLiked ? handleRemoveFromLikes(e) : handleLikeClick(e)
          }
          className={`card__button card__button_like ${isItemLiked && "card__button_like_active"
            } ${isHovered && "card__button_like_hovered"}`}
        >
          <svg
            viewBox="0 0 1024 1024"
            fill="currentColor"
            height="1em"
            width="1em"
          >
            <path d="M923 283.6a260.04 260.04 0 00-56.9-82.8 264.4 264.4 0 00-84-55.5A265.34 265.34 0 00679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 00-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z" />
          </svg>
        </button>

        {/* <div
          className={`card__image ${isHovered && "card__image_hovered"}`}
          style={{ backgroundImage: `url(${item.images[0]})` }}
        /> */}
        <Swiper
          slidesPerView={1}
          className="card__swiper"
          modules={[Pagination, EffectCards]}
          pagination
          loop
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setActiveIndex(swiper.realIndex);
          }}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        >
          <Image
            className="blur"
            src={item.images[0]}
            fill
            alt="фоновое изображение карточки"
            quality={30}
          />
          {item.images.map((image, index) => {
            const total = item.images.length;
            const prevIndex = (activeIndex - 1 + total) % total;
            const nextIndex = (activeIndex + 1) % total;

            const shouldRender = index === activeIndex || index === prevIndex || index === nextIndex;

            return (
              <SwiperSlide key={index} className="card__swiper_slide">
                {shouldRender && (
                  <Image
                    src={image}
                    alt={`Изображение ${item.name}`}
                    className="card__swiper_img"
                    loading="lazy"
                    fill
                  />
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Link>
      <h2 className="card__name">
        <Link href={link}>{item.name}</Link>
      </h2>
      <Link
        className="card__type"
        href={`/find?${new URLSearchParams({ type: item.type }).toString()}`}
      >
        {selectTypes.find(i => i.value == item.type)?.label || item.type}
      </Link>
      <p className="card__price">{item.price == 0 ? 'По запросу' : `${item.price.toLocaleString()} ₽`}</p>
    </>
  )

  const cartItem = (
    <>
      <CheckBox checked={item.selected!} onChange={handleSelectChange} />
      <Link href={link} target="_blank">
        <img src={item.images[0]} className="card__image" />
      </Link>

      <div className="card__container_column">
        <h2 className="card__name">
          <Link href={link}>{item.name}</Link>
        </h2>
        <div className="card__flex">
          <p className="card__type">{item.type}</p>
          <button
            className={`card__cart-button card__cart-button_like ${isItemLiked && "card__cart-button_like_active"
              }`}
            onClick={(e) =>
              isItemLiked ? handleRemoveFromLikes(e) : handleLikeClick(e)
            }
          >
            <svg
              viewBox="0 0 1024 1024"
              fill="currentColor"
              height="1em"
              width="1em"
            >
              <path d="M923 283.6a260.04 260.04 0 00-56.9-82.8 264.4 264.4 0 00-84-55.5A265.34 265.34 0 00679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 00-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z" />
            </svg>
          </button>
          <button
            className="card__cart-button card__cart-button_trash"
            onClick={handleRemoveFromCart}
          >
            <svg
              fill="currentColor"
              viewBox="0 0 16 16"
              height="1em"
              width="1em"
            >
              <path d="M5.5 5.5A.5.5 0 016 6v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm2.5 0a.5.5 0 01.5.5v6a.5.5 0 01-1 0V6a.5.5 0 01.5-.5zm3 .5a.5.5 0 00-1 0v6a.5.5 0 001 0V6z" />
              <path
                fillRule="evenodd"
                d="M14.5 3a1 1 0 01-1 1H13v9a2 2 0 01-2 2H5a2 2 0 01-2-2V4h-.5a1 1 0 01-1-1V2a1 1 0 011-1H6a1 1 0 011-1h2a1 1 0 011 1h3.5a1 1 0 011 1v1zM4.118 4L4 4.059V13a1 1 0 001 1h6a1 1 0 001-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
              />
            </svg>
          </button>
        </div>
      </div>
      <p className="card__price">{item.price == 0 ? 'По запросу' : `${item.price.toLocaleString()} ₽`}</p>
    </>
  );

  // Старая карточка
  const defaultItem = (
    <>
      <Link
        href={link}
        className={`card__container card__container_${type}`}
        style={{
          backgroundImage: `url(${item.images[1]})`,
        }}
        onMouseEnter={handleHovered}
        onMouseLeave={handleHovered}
        id={item.id.toString()}
      >
        <button
          onClick={(e) =>
            isItemInCart ? handleRemoveFromCart(e) : handleAddToCartClick(e)
          }
          className={`card__button card__button_buy ${isHovered && "card__button_buy_hovered"
            }`}
        >
          {isItemInCart ? "Убрать из корзины" : "В корзину"}
        </button>
        <button
          onClick={(e) =>
            isItemLiked ? handleRemoveFromLikes(e) : handleLikeClick(e)
          }
          className={`card__button card__button_like ${isItemLiked && "card__button_like_active"
            } ${isHovered && "card__button_like_hovered"}`}
        >
          <svg
            viewBox="0 0 1024 1024"
            fill="currentColor"
            height="1em"
            width="1em"
          >
            <path d="M923 283.6a260.04 260.04 0 00-56.9-82.8 264.4 264.4 0 00-84-55.5A265.34 265.34 0 00679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 00-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z" />
          </svg>
        </button>

        <div
          className={`card__image ${isHovered && "card__image_hovered"}`}
          style={{ backgroundImage: `url(${item.images[0]})` }}
        />
      </Link>
      <h2 className="card__name">
        <Link href={link}>{item.name}</Link>
      </h2>
      <Link
        className="card__type"
        href={`/find?${new URLSearchParams({ type: item.type }).toString()}`}
      >
        {selectTypes.find(i => i.value == item.type)?.label || item.type}
      </Link>
      <p className="card__price">{item.price == 0 ? 'По запросу' : `${item.price.toLocaleString()} ₽`}</p>
    </>
  );

  return (
    <div className={`card card_type_${type}`}>
      {/* {type == "cart" ? cartItem : defaultItem} дефолтная карточка*/}
      {type == "cart" ? cartItem : cardWithSlide}
    </div>
  );
}
