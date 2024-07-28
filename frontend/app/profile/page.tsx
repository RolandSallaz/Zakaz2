"use client";
import { useEffect, useState } from "react";
import { Hearts } from "react-loader-spinner";
import { ProtectedRoute } from "../components/ProtectedRoute/ProtectedRoute";
import useErrorHandler from "../lib/hooks/useErrorHandler";
import { ApiGetMyOrders } from "../lib/utils/api";
import { IOrder } from "../lib/utils/types";
import Orders from "../components/Orders/Orders";
import styles from "./page.module.scss";
export default function Page() {
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
    <ProtectedRoute>
      <main className={`main`}>
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
            <h2 className={styles.profile__heading}>
              {orders.length > 0 ? "Мои заказы" : "Заказов пока нет"}
            </h2>
            <Orders orders={orders} />
          </>
        )}
      </main>
    </ProtectedRoute>
  );
}
