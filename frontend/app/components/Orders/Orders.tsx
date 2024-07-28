import { IOrder } from "@/app/lib/utils/types";
import Order from "../Order/Order";
import "./Orders.scss";
interface Props {
  orders: IOrder[];
}

export default function Orders({ orders }: Props) {
  return (
    <section className="orders">
      {orders.map((order) => (
        <Order key={order.id} order={order} />
      ))}
    </section>
  );
}
