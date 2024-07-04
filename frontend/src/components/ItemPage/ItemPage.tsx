import { useNavigate, useParams } from 'react-router-dom';
import './ItemPage.scss';
import { IItem, ROLES } from '../../utils/types';
import { useEffect, useState } from 'react';
import { useSelector } from '../../services/store';
import { Hearts } from 'react-loader-spinner';
import useHover from '../../hooks/useHover';
import GlitchSquiggly from 'react-glitch-effect/core/GlitchSquiggly';
export default function ItemPage() {
  const { id } = useParams();
  const { data: allItems } = useSelector((state) => state.itemSlice);
  const [item, setItem] = useState<IItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const {
    userData: { auth_level },
  } = useSelector((state) => state.userSlice);
  const { handleHovered, isHovered } = useHover();
  const navigate = useNavigate();
  useEffect(() => {
    const foundedItem = allItems.find((item) => item.id == Number(id));
    if (foundedItem) {
      setItem(foundedItem);
      setLoading(false);
    }
  }, [navigate, allItems]);

  useEffect(() => {
    if (item) {
      setActiveImage(item.images[0]);
    }
  }, [item]);

  function handleArrowClick(action: 'left' | 'right') {
    if (!item) {
      return;
    }
    const imagesLength = item.images.length;
    const currIndex = item.images.findIndex((link) => link === activeImage);
    let nextIndex: number;

    if (action === 'left') {
      nextIndex = currIndex - 1;
      if (nextIndex < 0) {
        nextIndex = imagesLength - 1; // Если индекс становится меньше 0, устанавливаем его на последний элемент массива
      }
    } else {
      nextIndex = currIndex + 1;
      if (nextIndex >= imagesLength) {
        nextIndex = 0; // Если индекс становится больше или равен длине массива, сбрасываем его на 0
      }
    }

    setActiveImage(item.images[nextIndex]);
  }

  return (
    <main className="main ItemPage">
      {loading ? (
        <Hearts
          height="160"
          width="160"
          color="#f03535"
          ariaLabel="Загрука"
          wrapperClass="ItemPage__loading"
          visible={true}
        />
      ) : (
        <>
          <div className="ItemPage__container ItemPage__container_left">
            <div className="ItemPage__container ItemPage__container_name">
              <h1 className="ItemPage__name">{item?.name}</h1>
              <button className="ItemPage__button ItemPage__button_favorite">
                <svg
                  viewBox="0 0 1024 1024"
                  fill="currentColor"
                  height="1em"
                  width="1em"
                >
                  <path d="M923 283.6a260.04 260.04 0 00-56.9-82.8 264.4 264.4 0 00-84-55.5A265.34 265.34 0 00679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 00-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z" />
                </svg>
              </button>
            </div>

            <div
              className="image-slider"
              onMouseEnter={handleHovered}
              onMouseLeave={handleHovered}
            >
              <button
                className={`image-slider__button ${isHovered && 'image-slider__button_hovered'}`}
                onClick={() => handleArrowClick('left')}
              >
                {'<'}
              </button>
              <div
                className="image-slider__background-image"
                style={{ backgroundImage: `url(${activeImage})` }}
              />
              <img className="image-slider__image" src={activeImage} />
              <button
                className={`image-slider__button image-slider__button_right ${isHovered && 'image-slider__button_hovered'}`}
                onClick={() => handleArrowClick('right')}
              >
                {'>'}
              </button>
            </div>
            <div className="ItemPage__grid-container ItemPage__grid-container_images">
              {item?.images.map((image) => (
                <img
                  onClick={() => setActiveImage(image)}
                  key={image}
                  loading="lazy"
                  className={`ItemPage__image ${image == activeImage && 'ItemPage__image_active'}`}
                  id={image}
                  src={image}
                  alt={`Изображение ${item.name}`}
                />
              ))}
            </div>
            <label className="ItemPage__description">
              Описание
              <p className="ItemPage__description_text">{item?.description}</p>
            </label>
          </div>
          <div className="ItemPage__container ItemPage__container_right">
            <p className="ItemPage__price">
              {item?.price.toLocaleString('ru-RU')}
            </p>
            <div className="ItemPage__button-container">
              <button
                className="ItemPage__button"
                style={{ backgroundColor: '#00aaff' }}
              >
                В корзину
              </button>
              <button
                className="ItemPage__button"
                style={{ backgroundColor: '#02d15c' }}
              >
                Купить
              </button>
              {auth_level >= ROLES.MANAGER && (
                <GlitchSquiggly>
                  <button className="ItemPage__button">Редактировать</button>
                </GlitchSquiggly>
              )}
            </div>
          </div>
        </>
      )}
    </main>
  );
}
