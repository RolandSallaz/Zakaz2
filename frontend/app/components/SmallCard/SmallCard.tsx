import "./SmallCard.scss";
import { IItem } from "../../lib/utils/types";
import Link from "next/link";

interface props {
  item: IItem;
}

export default function SmallCard({ item }: props) {
  return (
    <Link className="SmallCard" href={`/items/${item.id}`} target="_blank">
      <img src={item.images[0]} alt={item.name} loading="lazy" />
      <p>{item.price.toLocaleString()} ₽</p>
    </Link>
  );
}
