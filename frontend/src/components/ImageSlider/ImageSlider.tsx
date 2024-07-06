import useHover from '../../hooks/useHover';
import { IItem } from '../../utils/types';
import './ImageSlider.scss';

interface props {
  item: IItem | null;
  activeImage: string;
  setActiveImage: (arg: string) => void;
}

export default function ImageSlider({
  item,
  activeImage,
  setActiveImage,
}: props) {
  const { handleHovered, isHovered } = useHover();

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
  );
}
