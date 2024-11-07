"use client";
import { useState } from "react";
import "swiper/css";
import 'swiper/css/zoom';
import SwiperCore from 'swiper';
import { Autoplay, Zoom } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useMediaQuery } from "react-responsive";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/store";
import { useRouter } from "next/navigation";
import {
  addLikes,
  addToCart,
  removeFromCart,
  removeFromLikes,
} from "@/app/lib/redux/slices/appSlice";
import { IItem, ROLES } from "@/app/lib/utils/types";
import "./ItemPage.scss";
import ImageSlider from "../ImageSlider/ImageSlider";

interface ItemPageProps {
  item: IItem;
}
SwiperCore.use([Zoom]);

export default function ItemPage({ item }: ItemPageProps) {
  const [activeImage, setActiveImage] = useState<string>(item.images[0]);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const isMobile = useMediaQuery({ maxWidth: 1279 });

  const dispatch = useAppDispatch();
  const { cart, likes } = useAppSelector((state) => state.appSlice);
  const { userData: { auth_level } } = useAppSelector((state) => state.userSlice);
  const itemId = item.id;
  const router = useRouter();

  const isItemInCart = Boolean(cart.find((cartItem) => item.id === cartItem.id));
  const isItemLiked = Boolean(likes.find((likeItem) => item.id === likeItem.id));

  const handleCartClick = () => {
    isItemInCart ? dispatch(removeFromCart(itemId)) : dispatch(addToCart(itemId));
  };

  const handleFavoriteClick = () => {
    isItemLiked ? dispatch(removeFromLikes(itemId)) : dispatch(addLikes(itemId));
  };

  const handleBuyClick = () => {
    router.push(`/order?items=[${item.id}]`);
  };

  const handleEditClick = () => {
    router.push(`/admin/items/edit/${item.id}`);
  };

  const makeLinksClickable = (text: string) => {
    const linkRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;
    const textWithLinks = text.replace(linkRegex, (url) => {
      return `<a class="link ItemPage__link" href="${url}" target="_blank" rel="noopener noreferrer">${url.replace(/(http)s?:\/\//gi, "")}</a>`;
    });
    return <div dangerouslySetInnerHTML={{ __html: textWithLinks }} />;
  };

  const openFullscreen = (image: string) => {
    setActiveImage(image);
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  return (
    <main className="main ItemPage">
      <div className="ItemPage__container ItemPage__container_left">
        <h1 className="ItemPage__name">{item.name}</h1>

        {isMobile ? (
          <Swiper slidesPerView={1} spaceBetween={10} className="swiper" modules={[Autoplay]}>
            {item.images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  onClick={() => openFullscreen(image)}
                  src={image}
                  alt={`Изображение ${item.name}`}
                  className={`ItemPage__image ${image === activeImage && "ItemPage__image_active"}`}
                  loading="lazy"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <ImageSlider
            item={item}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
          />
        )}
        {isFullscreen && (
          <div className="fullscreen-overlay" onClick={closeFullscreen}>
            <Swiper
              slidesPerView={1}
              spaceBetween={10}
              initialSlide={item.images.indexOf(activeImage || "")}
              className="fullscreen-swiper"
              zoom={true} // Включаем возможность масштабирования
            >
              {item.images.map((image, index) => (
                <SwiperSlide key={index} zoom>
                  {/* Оборачиваем изображение в swiper-zoom-container */}
                  <div className="swiper-zoom-container">
                    <img src={image} alt={`Изображение ${item.name}`} className="fullscreen-image" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
        <label className="ItemPage__description">
          Описание
          <p className="ItemPage__description_text">{makeLinksClickable(item.description)}</p>
          <p className="ItemPage__description_text">*Цена может отличаться, так как напрямую зависит от Курса, уточнять у менеджера</p>
        </label>
      </div>

      <div className="ItemPage__container ItemPage__container_right">
        <p className="ItemPage__price">{item.price.toLocaleString("ru-RU")}</p>
        <div className="ItemPage__button-container">
          <button
            className={`ItemPage__button ${isItemInCart ? "ItemPage__button_purple" : "ItemPage__button_green"}`}
            onClick={handleCartClick}
          >
            {isItemInCart ? "В корзине" : "В корзину"}
          </button>
          <button className="ItemPage__button ItemPage__button_buy" onClick={handleBuyClick}>
            Купить
          </button>
          {auth_level >= ROLES.MANAGER && (
            <button onClick={handleEditClick} className="ItemPage__button">
              Редактировать
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
