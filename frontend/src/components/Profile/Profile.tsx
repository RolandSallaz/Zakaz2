import { useEffect, useState } from 'react';
import './Profile.scss';
import { ApiGetMyOrders } from '../../utils/api';
import useErrorHandler from '../../hooks/useErrorHandler';
import { Hearts } from 'react-loader-spinner';
import { IOrder } from '../../utils/types';
import SmallCard from '../SmallCard/SmallCard';
import { getProductStateText } from '../../utils/utils';

export default function Profile() {
  const { handleError } = useErrorHandler();
  const [loading, setLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<IOrder[]>([]);
  useEffect(() => {
    ApiGetMyOrders()
      .then(setOrders)
      .catch(handleError)
      .finally(() => setLoading(false));
  }, []);
  return (
    <main className="main Profile">
      {loading ? (
        <Hearts
          height="160"
          width="160"
          color="#f03535"
          ariaLabel="Загрука"
          wrapperClass="ItemPage__loading"
          visible={true}
        />
      ) : (
        <>
          <section className="orders">
            <h2 className="orders__heading">
              {orders.length > 0 ? 'Мои заказы' : 'Заказов пока нет'}
            </h2>
            {orders.map((order) => (
              <div className="order">
                <p>Номер заказа: {order.id}</p>
                <p>
                  Заказ от:{' '}
                  {new Date(order.create_date).toLocaleDateString('en-GB')}
                </p>
                <p>
                  На сумму:{' '}
                  {order.items
                    .reduce((total, item) => total + item.price, 0)
                    .toLocaleString()}{' '}
                  ₽
                </p>
                <p>Сотояние: {getProductStateText(order.state)}</p>
                <div className="greed">
                  {order.items.map((item) => (
                    <SmallCard item={item} key={item.id} />
                  ))}
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
