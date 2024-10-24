import { ChangeEvent } from "react";
import { IItem, TCardType } from "../../lib/utils/types";
import Card from "../Card/Card";
import "./Cards.scss";

interface props {
  items: IItem[];
  columnsCount?: number;
  type?: TCardType;
  onCheckBoxChange?: (e: ChangeEvent<HTMLInputElement>, item: IItem) => void;
}
export default function Cards({
  items,
  columnsCount,
  type = "default",
  onCheckBoxChange = () => null,
}: props) {
  return (
    <section
      className={`cards cards_type_${type}`}
      style={{
        gridTemplateColumns: `repeat(${columnsCount || 3}, minmax(100px, 1fr))`,
      }}
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
