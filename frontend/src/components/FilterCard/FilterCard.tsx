import useHover from '../../hooks/useHover';
import './FilterCard.scss';

interface props {
  image: string;
  text: string;
  description: string;
}

export default function FilterCard({ image, text, description }: props) {
  const { isHovered, handleHovered } = useHover();

  return (
    <div
      className="filterCard"
      onMouseEnter={handleHovered}
      onMouseLeave={handleHovered}
    >
      <img
        src={image}
        className={`filterCard__image ${isHovered && 'filterCard__image_hovered'}`}
        alt="Изображение карточки"
      ></img>
      <div className="filterCard__container">
        <h2 className="filterCard__heading">{text}</h2>
        <p className="filterCard__description">{description}</p>
        <p
          className={`filterCard__button ${isHovered && 'filterCard__button_hovered'}`}
        >
          Подробнее
        </p>
      </div>
    </div>
  );
}
