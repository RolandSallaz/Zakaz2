import { useEffect, useState } from 'react';
import './OrderPage.scss';
import { Hearts } from 'react-loader-spinner';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ApiGetActualItemsInfo, ApiSendOrder } from '../../utils/api';
import { IItem, IOrderDto } from '../../utils/types';
import useErrorHandler from '../../hooks/useErrorHandler';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from '../../services/store';
import { removeFromCart } from '../../services/slices/appSlice';
import { getProductText } from '../../utils/utils';

interface IFormValues {
  telegram: string;
  phone: string;
}

export default function OrderPage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [items, setItems] = useState<IItem[]>([]);
  const [searchParams] = useSearchParams();
  const [sendingLoading, setSendingLoading] = useState<boolean>(false);
  const { handleError } = useErrorHandler();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormValues>();
  useEffect(() => {
    setIsLoading(false);
    const items = searchParams.get('items');
    if (items) {
      ApiGetActualItemsInfo(items)
        .then(setItems)
        .catch(handleError)
        .finally(() => setIsLoading(false));
    }
  }, []);

  const onSubmit: SubmitHandler<IFormValues> = (data) => {
    setSendingLoading(true);
    const itemsIds = items.map((item) => item.id);
    const dto: IOrderDto = { ...data, itemsIds };
    ApiSendOrder(dto)
      .then(() => {
        navigate('/');
        items.forEach((item) => dispatch(removeFromCart(item.id)));
      })
      .catch(handleError)
      .finally(() => setSendingLoading(false));
  };

  return (
    <main className="main OrderPage">
      {isLoading ? (
        <Hearts
          height="160"
          width="160"
          color="#f03535"
          ariaLabel="Загрука"
          wrapperClass="ItemPage__loading"
          visible={true}
        />
      ) : (
        <form className="OrderPage__form" onSubmit={handleSubmit(onSubmit)}>
          <div className="OrderPage__column">
            <label className="OrderPage__input-label">
              <input
                className={`OrderPage__input ${errors.telegram && 'OrderPage__input_error'}`}
                placeholder="Ник в telegram *"
                {...register('telegram', { required: true })}
              />
              <svg
                fill="currentColor"
                viewBox="0 0 16 16"
                height="1em"
                width="1em"
              >
                <path d="M16 8A8 8 0 110 8a8 8 0 0116 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 01-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 00-.013-.315.337.337 0 00-.114-.217.526.526 0 00-.31-.093c-.3.005-.763.166-2.984 1.09z" />
              </svg>
            </label>
            <label className="OrderPage__input-label">
              <input
                className={`OrderPage__input ${errors.phone && 'OrderPage__input_error'}`}
                placeholder="Телефонный номер *"
                {...register('phone', {
                  required: true,
                  pattern: {
                    value:
                      /^[+]?\d{1,2}\s?\(?\d{3}\)?\s?\d{3}\-|\s?\d{2}\-|\s?\d{2}$/,
                    message: 'Некорректный номер телефона',
                  },
                })}
              />
              <svg
                viewBox="0 0 1024 1024"
                fill="currentColor"
                height="1em"
                width="1em"
              >
                <path d="M885.6 230.2L779.1 123.8a80.83 80.83 0 00-57.3-23.8c-21.7 0-42.1 8.5-57.4 23.8L549.8 238.4a80.83 80.83 0 00-23.8 57.3c0 21.7 8.5 42.1 23.8 57.4l83.8 83.8A393.82 393.82 0 01553.1 553 395.34 395.34 0 01437 633.8L353.2 550a80.83 80.83 0 00-57.3-23.8c-21.7 0-42.1 8.5-57.4 23.8L123.8 664.5a80.89 80.89 0 00-23.8 57.4c0 21.7 8.5 42.1 23.8 57.4l106.3 106.3c24.4 24.5 58.1 38.4 92.7 38.4 7.3 0 14.3-.6 21.2-1.8 134.8-22.2 268.5-93.9 376.4-201.7C828.2 612.8 899.8 479.2 922.3 344c6.8-41.3-6.9-83.8-36.7-113.8z" />
              </svg>
            </label>
            <div className="OrderPage__grid-container">
              {items.map((item) => (
                <Link
                  className="OrderPage__grid-item"
                  key={item.id}
                  to={`/items/${item.id}`}
                  target="_blank"
                >
                  <img src={item.images[0]} alt={item.description} />
                  <p>{item.price.toLocaleString()} ₽</p>
                </Link>
              ))}
            </div>
          </div>
          <div className="OrderPage__column OrderPage__column_right">
            <button
              type="submit"
              className="OrderPage__button_order"
              disabled={sendingLoading}
            >
              Оформить
            </button>
            <div className="OrderPage__space-between">
              <h2>Ваш заказ</h2>
              <p>
                {' '}
                {items.length} {getProductText(items.length)}
              </p>
            </div>
            <div className="OrderPage__space-between">
              <h3>Итого</h3>
              <p>
                {' '}
                {items
                  .reduce((total, item) => total + item.price, 0)
                  .toLocaleString()}{' '}
                ₽
              </p>
            </div>
          </div>
        </form>
      )}
    </main>
  );
}
