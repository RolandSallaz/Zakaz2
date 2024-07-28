"use client";
import { Suspense } from "react";
import OrderPage from "../components/OrderPage/OrderPage";

export default function Page() {
  return (
    <Suspense>
      <OrderPage />
    </Suspense>
  );
}
