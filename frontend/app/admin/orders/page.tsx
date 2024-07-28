"use client";
import Order from "@/app/components/Order/Order";
import useErrorHandler from "@/app/lib/hooks/useErrorHandler";
import { openSnackBar } from "@/app/lib/redux/slices/appSlice";
import { useAppDispatch } from "@/app/lib/redux/store";
import { ApiGetAllOrders, ApiUpdateOrder } from "@/app/lib/utils/api";
import { IOrder, ISelect } from "@/app/lib/utils/types";
import { parseNumbers } from "@/app/lib/utils/utils";
import React, { ChangeEvent, useEffect, useState } from "react";
import Select from "react-select";
import styles from "./page.module.scss";
const selectOptions = [
  { value: "*", label: "Все" },
  { value: "is_error", label: "С ошибкой" },
];

export default function Page() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [filterType, setFilterType] = useState<ISelect>(selectOptions[0]);
  const [inputValue, setInputValue] = useState<string>("");
  const { handleError } = useErrorHandler();
  const dispatch = useAppDispatch();
  useEffect(() => {
    ApiGetAllOrders().then(setOrders).catch(handleError);
  }, []);

  useEffect(() => {
    const filteredByType =
      filterType.value === selectOptions[0].value
        ? orders
        : orders.filter((order) => order.is_error == true);

    setFilteredOrders(
      filteredByType.filter(
        (order) =>
          order.customer_email.includes(inputValue) ||
          order.id.toString().startsWith(inputValue) ||
          order.telegram.includes(inputValue) ||
          parseNumbers(order.phone).includes(parseNumbers(inputValue))
      )
    );
  }, [filterType, inputValue, orders]);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputValue(value);
  }

  const handleChangeSelect = (selected: ISelect | null) => {
    if (selected) {
      setFilterType(selected);
    }
  };

  function makeOrderErrorRead(order: IOrder) {
    ApiUpdateOrder(order.id, { ...order, is_error: false })
      .then((newOrder) => {
        setOrders((prev) =>
          prev.map((item) => (item.id == newOrder.id ? newOrder : item))
        );
        dispatch(openSnackBar({ text: "Успешно" }));
      })
      .catch(handleError);
  }
  return (
    <main className="main">
      <section className={styles.AdminItemsPage}>
        <div className={styles.AdminItemsPage__flex_container}>
          <input
            className={styles.admin__input}
            placeholder="Поиск заказа"
            onChange={handleInputChange}
          />
          <Select
            className={styles.FindPage__select}
            options={selectOptions}
            onChange={handleChangeSelect}
            value={filterType}
          />
        </div>

        <div className={styles.AdminItemsPage__grid_container}>
          {filteredOrders?.map((order) => (
            <Order
              key={order.id}
              order={order}
              isAdmin
              onCleanError={makeOrderErrorRead}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
