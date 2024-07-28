import { IOrder } from "../../lib/utils/types";
import SmallCard from "../SmallCard/SmallCard";

import "./Order.scss";

interface props {
  order: IOrder;
  isAdmin?: boolean;
  onCleanError?: (order: IOrder) => void;
}

export default function Order({ order, isAdmin, onCleanError }: props) {
  return (
    <div className="order">
      <p>Номер заказа: {order.id}</p>
      {isAdmin && (
        <>
          {order.is_error && (
            <div className="order__container">
              <p style={{ color: "red" }}>Сообщение не отправлено в tg</p>
              <button onClick={() => onCleanError && onCleanError(order)}>
                Прочитано
              </button>
            </div>
          )}
          <p>Пользователь {order.customer_email}</p>
          <p>Телеграм {order.telegram}</p>
          <p>Номер телефона {order.phone}</p>
        </>
      )}

      <p>Заказ от: {new Date(order.create_date).toLocaleDateString("en-GB")}</p>
      <p>
        На сумму:{" "}
        {order.items
          .reduce((total, item) => total + item.price, 0)
          .toLocaleString()}{" "}
        ₽
      </p>
      {/* <p>Сотояние: {getProductStateText(order.state)}</p> */}
      <div className="grid">
        {order.items.map((item) => (
          <SmallCard item={item} key={item.id} />
        ))}
      </div>
    </div>
  );
}
