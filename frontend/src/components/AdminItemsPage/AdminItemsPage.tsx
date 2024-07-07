import { formatDistance } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import { ChangeEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useErrorHandler from '../../hooks/useErrorHandler';
import { openSnackBar } from '../../services/slices/appSlice';
import { setItems } from '../../services/slices/itemSlice';
import { useDispatch, useSelector } from '../../services/store';
import { ApiDeleteItem } from '../../utils/api';
import { IItem } from '../../utils/types';
import './AdminItemsPage.scss';
import { useConfirmPopup } from '../../context/ConfirmPopupContext';

export default function AdminItemsPage() {
  const { data: items } = useSelector((state) => state.itemSlice);
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const { handleError } = useErrorHandler();
  const dispatch = useDispatch();
  const { openConfirmPopup } = useConfirmPopup();

  function handleItemInputChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.trim();

    if (value === '') {
      setFilteredItems(items);
    } else {
      const filteredData = items.filter(
        (item) =>
          item.name.startsWith(value) ||
          item.id.toString() === value ||
          item.description.startsWith(value),
      );
      setFilteredItems(filteredData);
    }
  }
  useEffect(() => {
    setFilteredItems(items);
  }, []);

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
    <main className="main">
      <Link className="link AdminItemsPage__link" to={'./add'}>
        Добавить новый
      </Link>
      <section className="AdminItemsPage">
        <input
          className="admin__input"
          placeholder="Поиск пользователя"
          onChange={handleItemInputChange}
        />
        <table className="select">
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
                    : 'Бессрочно'}
                </td>
                <td>{item.is_active ? 'Да' : 'Нет'}</td>
                <td>
                  <button onClick={() => {}}>Редактировать</button>
                </td>
                <td>
                  <button
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
