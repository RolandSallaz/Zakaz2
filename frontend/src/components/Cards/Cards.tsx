import { IItem } from '../../utils/types';
import Card from '../Card/Card';
import './Cards.scss';

interface props {
  items: IItem[];
}
export default function Cards({ items }: props) {
  return (
    <section className="cards">
      {items?.map((item) => <Card key={item.id} item={item} />)}
    </section>
  );
}
