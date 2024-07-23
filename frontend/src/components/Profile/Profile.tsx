import { useEffect, useState } from 'react';
import { Hearts } from 'react-loader-spinner';
import useErrorHandler from '../../hooks/useErrorHandler';
import { ApiGetMyOrders } from '../../utils/api';
import { IOrder } from '../../utils/types';
import Order from '../Order/Order';
import './Profile.scss';

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
              <Order order={order} />
            ))}
          </section>
        </>
      )}
    </main>
  );
}
