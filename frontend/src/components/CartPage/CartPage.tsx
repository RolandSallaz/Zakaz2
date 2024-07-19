import { ChangeEvent, useEffect, useState } from 'react';
import { IItem } from '../../utils/types';
import './CartPage.scss';
import { useSelector } from '../../services/store';
import Cards from '../Cards/Cards';
import CheckBox from '../CheckBox/CheckBox';
import { useNavigate } from 'react-router-dom';
import { getProductText } from '../../utils/utils';

export default function CartPage() {
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(true);
  const [selectedItems, setSelectedItems] = useState<IItem[]>([]);
  const { data: items } = useSelector((state) => state.itemSlice);
  const { cart } = useSelector((state) => state.appSlice);
  const navigate = useNavigate();
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
    navigate(`/order?items=[${selectedItems.map((item) => item.id)}]`);
  }

  return (
    <main className="main CartPage">
      {filteredItems.length == 0 ? (
        <h2 className="CartPage__heading">Корзина пуста</h2>
      ) : (
        <>
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
              <p>
                {filteredItems.length} {getProductText(filteredItems.length)}
              </p>
            </div>
            <div className="CartPage__contaner CartPage__container_flex">
              <p>Выбрано товаров ({selectedItems.length})</p>
              <p>
                {selectedItems
                  .reduce((total, item) => total + item.price, 0)
                  .toLocaleString()}
                руб
              </p>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
