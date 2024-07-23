import { ChangeEvent, useEffect, useState } from 'react';
import Select from 'react-select';
import useErrorHandler from '../../hooks/useErrorHandler';
import { ApiGetAllOrders, ApiUpdateOrder } from '../../utils/api';
import { IOrder, ISelect } from '../../utils/types';
import { parseNumbers } from '../../utils/utils';
import Order from '../Order/Order';
import './AdminOrders.scss';
import { useDispatch } from '../../services/store';
import { openSnackBar } from '../../services/slices/appSlice';

const selectOptions = [
  { value: '*', label: 'Все' },
  { value: 'is_error', label: 'С ошибкой' },
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [filterType, setFilterType] = useState<ISelect>(selectOptions[0]);
  const [inputValue, setInputValue] = useState<string>('');
  const { handleError } = useErrorHandler();
  const dispatch = useDispatch();
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
          parseNumbers(order.phone).includes(parseNumbers(inputValue)),
      ),
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
          prev.map((item) => (item.id == newOrder.id ? newOrder : item)),
        );
        dispatch(openSnackBar({ text: 'Успешно' }));
      })
      .catch(handleError);
  }

  return (
    <main className="main">
      <section className="AdminItemsPage">
        <div className="AdminItemsPage__flex-container">
          <input
            className="admin__input"
            placeholder="Поиск заказа"
            onChange={handleInputChange}
          />
          <Select
            className="FindPage__select"
            options={selectOptions}
            onChange={handleChangeSelect}
            value={filterType}
          />
        </div>

        <div className="AdminItemsPage__grid-container">
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
