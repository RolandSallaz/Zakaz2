import './SmallCard.scss';
import { Link } from 'react-router-dom';
import { IItem } from '../../utils/types';

interface props {
  item: IItem;
}

export default function SmallCard({ item }: props) {
  return (
    <Link className="SmallCard" to={`/items/${item.id}`} target="_blank">
      <img src={item.images[0]} alt={item.name} />
      <p>{item.price.toLocaleString()} ₽</p>
    </Link>
  );
}
