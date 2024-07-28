"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useAppSelector } from "../lib/redux/store";
import { useRouter } from "next/navigation";
import { IItem } from "../lib/utils/types";
import CheckBox from "../components/CheckBox/CheckBox";
import Cards from "../components/Cards/Cards";
import { getProductText } from "../lib/utils/utils";
import styles from "./page.module.scss";
export default function Page() {
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(true);
  const [selectedItems, setSelectedItems] = useState<IItem[]>([]);
  const { data: items } = useAppSelector((state) => state.itemSlice);
  const { cart } = useAppSelector((state) => state.appSlice);
  const router = useRouter();
  useEffect(() => {
    const itemsFromCart: IItem[] = items.filter((item) =>
      cart.some((cartItem) => cartItem.id === item.id)
    );

    setFilteredItems(
      itemsFromCart.map((item) => ({ ...item, selected: isAllSelected })) //Выбираем все товары по умолчанию
    );
  }, [items, cart]);

  function handleSelectAllChange(e: ChangeEvent<HTMLInputElement>) {
    setIsAllSelected(e.target.checked);
  }

  useEffect(() => {
    setFilteredItems((prev) =>
      prev.map((item) => ({ ...item, selected: isAllSelected }))
    );
  }, [isAllSelected]);

  useEffect(() => {
    setSelectedItems(filteredItems.filter((item) => item.selected));
  }, [filteredItems]);

  function handleItemSelectChange(
    e: ChangeEvent<HTMLInputElement>,
    item: IItem
  ) {
    const moddedItem: IItem =
      filteredItems.find((oldItem) => oldItem.id == item.id) || item;
    moddedItem.selected = e.target.checked;
    setFilteredItems((prev) =>
      prev.filter((oldItem) => (oldItem.id == item.id ? moddedItem : oldItem))
    );
  }

  function handleToOrderPage() {
    router.push(`/order?items=[${selectedItems.map((item) => item.id)}]`);
  }

  return (
    <main className={`main ${styles.CartPage}`}>
      {filteredItems.length === 0 ? (
        <h2 className={styles.CartPage__heading}>Корзина пуста</h2>
      ) : (
        <>
          <div className={styles.CartPage__column}>
            <label
              className={styles.CartPage__select}
              htmlFor="checkBoxCartPage"
            >
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
          <div
            className={`${styles.CartPage__column} ${styles.CartPage__column_right}`}
          >
            <button
              className={styles.CartPage__button_order}
              onClick={handleToOrderPage}
              disabled={selectedItems.length === 0}
            >
              Перейти к оформлению
            </button>
            <div
              className={`${styles.CartPage__container} ${styles.CartPage__container_flex}`}
            >
              <h3>Ваша корзина</h3>
              <p>
                {filteredItems.length} {getProductText(filteredItems.length)}
              </p>
            </div>
            <div
              className={`${styles.CartPage__container} ${styles.CartPage__container_flex}`}
            >
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
