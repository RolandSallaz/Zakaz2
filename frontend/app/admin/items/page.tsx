"use client";
import { useConfirmPopup } from "@/app/components/context/ConfirmPopupContext";
import useErrorHandler from "@/app/lib/hooks/useErrorHandler";
import { openSnackBar } from "@/app/lib/redux/slices/appSlice";
import { setItems } from "@/app/lib/redux/slices/itemSlice";
import { useAppDispatch, useAppSelector } from "@/app/lib/redux/store";
import { ApiDeleteItem } from "@/app/lib/utils/api";
import { IItem } from "@/app/lib/utils/types";
import Link from "next/link";
import React, { ChangeEvent, useEffect, useState } from "react";
import { formatDistance } from "date-fns";
import { ru } from "date-fns/locale/ru";
import styles from "./page.module.scss";
export default function Page() {
  const { data: items } = useAppSelector((state) => state.itemSlice);
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const { handleError } = useErrorHandler();
  const dispatch = useAppDispatch();
  const { openConfirmPopup } = useConfirmPopup();

  function handleItemInputChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.trim();

    if (value === "") {
      setFilteredItems(items);
    } else {
      const filteredData = items.filter(
        (item) =>
          item.name.includes(value) ||
          item.id.toString() === value ||
          item.description.includes(value) ||
          item.type.includes(value)
      );
      setFilteredItems(filteredData);
    }
  }
  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  function handleDeleteItem(id: number) {
    ApiDeleteItem(id)
      .then(() => {
        dispatch(setItems(items.filter((item) => item.id !== id)));
        setFilteredItems((prev) => prev.filter((item) => item.id !== id));
        dispatch(openSnackBar({ text: `Карточка с id ${id} успешно удалена` }));
      })
      .catch(handleError);
  }
  return (
    <main className={"main"}>
      <Link
        className={`${styles.link} ${styles.AdminItemsPage__link} ${styles.AdminItemsPage__button}`}
        href={"./items/add"}
      >
        Добавить новый
      </Link>
      <section className={styles.AdminItemsPage}>
        <input
          className={styles.admin__input}
          placeholder="Поиск пользователя"
          onChange={handleItemInputChange}
        />
        <table className={styles.select}>
          <thead>
            <tr>
              <th>Id</th>
              <th>Название</th>
              <th>Цена</th>
              <th>Оставшееся время</th>
              <th>Активно</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems?.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.price}₽</td>
                <td>
                  {item.end_sell_date
                    ? formatDistance(new Date(), new Date(item.end_sell_date), {
                        locale: ru,
                      })
                    : "Бессрочно"}
                </td>
                <td>{item.is_active ? "Да" : "Нет"}</td>
                <td>
                  <Link
                    className={`${styles.link} ${styles.AdminItemsPage__button}`}
                    href={`/admin/items/edit/${item.id}`}
                  >
                    Редактировать
                  </Link>
                </td>
                <td>
                  <button
                    className={styles.AdminItemsPage__button}
                    onClick={() => {
                      openConfirmPopup(() => handleDeleteItem(item.id));
                    }}
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
