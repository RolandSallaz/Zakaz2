import { ChangeEvent, useEffect, useState } from 'react';
import { IItem } from '../../utils/types';
import './CartPage.scss';
import { useSelector } from '../../services/store';
import Cards from '../Cards/Cards';
import CheckBox from '../CheckBox/CheckBox';

export default function CartPage() {
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(true);
  const [selectedItems, setSelectedItems] = useState<IItem[]>([]);
  const { data: items } = useSelector((state) => state.itemSlice);
  const { cart } = useSelector((state) => state.appSlice);

  useEffect(() => {
    const itemsFromCart: IItem[] = items.filter((item) =>
      cart.some((cartItem) => cartItem.id === item.id),
    );

    setFilteredItems(
      itemsFromCart.map((item) => ({ ...item, selected: isAllSelected })), //Выбираем все товары по умолчанию
    );
  }, [items, cart]);

  function handleSelectAllChange(e: ChangeEvent<HTMLInputElement>) {
    setIsAllSelected(e.target.checked);
  }

  useEffect(() => {
    setFilteredItems((prev) =>
      prev.map((item) => ({ ...item, selected: isAllSelected })),
    );
  }, [isAllSelected]);

  useEffect(() => {
    setSelectedItems(filteredItems.filter((item) => item.selected));
  }, [filteredItems]);

  function handleItemSelectChange(
    e: ChangeEvent<HTMLInputElement>,
    item: IItem,
  ) {
    const moddedItem: IItem =
      filteredItems.find((oldItem) => oldItem.id == item.id) || item;
    moddedItem.selected = e.target.checked;
    setFilteredItems((prev) =>
      prev.filter((oldItem) => (oldItem.id == item.id ? moddedItem : oldItem)),
    );
  }

  function handleToOrderPage() {
    console.log(selectedItems);
  }

  return (
    <main className="main CartPage">
      <div className="CartPage__column">
        <label className="CartPage__select" htmlFor="checkBoxCartPage">
          <CheckBox
            labelId="checkBoxCartPage"
            checked={isAllSelected}
            onChange={handleSelectAllChange}
          />
          Выбрать все
        </label>
        <Cards
          items={filteredItems}
          type="cart"
          onCheckBoxChange={handleItemSelectChange}
        />
      </div>
      <div className="CartPage__column CartPage__column_right">
        <button
          className="CartPage__button_order"
          onClick={handleToOrderPage}
          disabled={selectedItems.length == 0}
        >
          Перейти к оформлению
        </button>
        <div className="CartPage__contaner CartPage__container_flex">
          <h3>Ваша корзина</h3>
          <p>1 товар</p>
        </div>
        <div className="CartPage__contaner CartPage__container_flex">
          <p>Товары (1)</p>
          <p>2 500 р</p>
        </div>
      </div>
    </main>
  );
}
