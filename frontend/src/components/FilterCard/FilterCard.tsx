import { Link, useNavigate } from 'react-router-dom';
import useHover from '../../hooks/useHover';
import './FilterCard.scss';

interface props {
  image: string;
  text: string;
  description: string;
  param: { name: string; value: string };
}

export default function FilterCard({ image, text, description, param }: props) {
  const { isHovered, handleHovered } = useHover();
  const navigate = useNavigate();
  const link = `/find?${new URLSearchParams({ [param.name]: param.value }).toString()}`;
  function handleCardClick() {
    navigate(link);
  }

  return (
    <div
      className="filterCard"
      onMouseEnter={handleHovered}
      onMouseLeave={handleHovered}
      onClick={handleCardClick}
    >
      <img
        src={image}
        className={`filterCard__image ${isHovered && 'filterCard__image_hovered'}`}
        alt="Изображение карточки"
      ></img>
      <div className="filterCard__container">
        <h2 className="filterCard__heading">{text}</h2>
        <p className="filterCard__description">{description}</p>
        <Link
          className={`filterCard__button ${isHovered && 'filterCard__button_hovered'}`}
          to={link}
        >
          Подробнее
        </Link>
      </div>
    </div>
  );
}
