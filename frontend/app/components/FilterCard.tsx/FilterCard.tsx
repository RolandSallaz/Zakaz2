"use client";
import useHover from "@/app/lib/hooks/useHover";
import Link from "next/link";
import Image from "next/image";
import "./FilterCard.scss";
import { useRouter } from "next/navigation";
interface props {
  image: string;
  text: string;
  description: string;
  param: { name: string; value: string };
  aboutText?: string;
}

export default function FilterCard({ image, text, description, param, aboutText = 'Открыть' }: props) {
  const router = useRouter();
  const { isHovered, handleHovered } = useHover();
  const link = `/find?${new URLSearchParams({
    [param.name]: param.value,
  }).toString()}`;

  function handleCardClick() {
    router.push(link);
  }

  return (
    <div
      className={"filterCard"}
      onMouseEnter={handleHovered}
      onMouseLeave={handleHovered}
      onClick={handleCardClick}
    >
      <img
        src={image}
        className={`filterCard__image ${isHovered && "filterCard__image_hovered"
          }`}
        alt="Изображение карточки"
      />
      <div className="filterCard__container">
        <h3 className="filterCard__heading">{text}</h3>
        <p className="filterCard__description">{description}</p>
        <Link
          className={`filterCard__button ${isHovered && "filterCard__button_hovered"
            }`}
          href={link}
        >
          {aboutText}
        </Link>
      </div>
    </div>
  );
}
