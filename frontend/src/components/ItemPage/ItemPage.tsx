import { useNavigate, useParams } from 'react-router-dom';
import './ItemPage.scss';
import { IItem } from '../../utils/types';
import { useEffect, useState } from 'react';
import { useSelector } from '../../services/store';
import { Hearts } from 'react-loader-spinner';
import useHover from '../../hooks/useHover';
export default function ItemPage() {
  const { id } = useParams();
  const { data: allItems } = useSelector((state) => state.itemSlice);
  const [item, setItem] = useState<IItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImage, setActiveImage] = useState<string>('');
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
              <button>Добавить в избранное</button>
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
            <p>{item?.price}</p>
            <button>Купить</button>
            <button>Добавить в корзину</button>
          </div>
        </>
      )}
    </main>
  );
}
