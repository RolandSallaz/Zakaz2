import { IItem, TCardType } from '../../utils/types';
import Card from '../Card/Card';
import './Cards.scss';
import { ChangeEvent } from 'react';

interface props {
  items: IItem[];
  columnsCount?: number;
  type?: TCardType;
  onCheckBoxChange?: (e: ChangeEvent<HTMLInputElement>, item: IItem) => void;
}
export default function Cards({
  items,
  columnsCount = 4,
  type = 'default',
  onCheckBoxChange = () => null,
}: props) {
  return (
    <section
      className={`cards cards_type_${type}`}
      style={{ gridTemplateColumns: `repeat(${columnsCount}, 1fr)` }}
    >
      {items?.map((item) => (
        <Card
          key={item.id}
          item={item}
          type={type}
          onCheckBoxChange={onCheckBoxChange}
        />
      ))}
    </section>
  );
}
