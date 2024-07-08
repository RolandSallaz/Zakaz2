import { IItem } from '../../utils/types';
import Card from '../Card/Card';
import './Cards.scss';

interface props {
  items: IItem[];
  columnsCount?: number;
}
export default function Cards({ items, columnsCount = 4 }: props) {
  return (
    <section
      className="cards"
      style={{ gridTemplateColumns: `repeat(${columnsCount}, 1fr)` }}
    >
      {items?.map((item) => (
        <Card key={item.id} item={item} isBig={Boolean(columnsCount < 4)} />
      ))}
    </section>
  );
}
