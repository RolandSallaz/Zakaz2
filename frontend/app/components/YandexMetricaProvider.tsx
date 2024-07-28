import { ReactNode } from "react";
import { YMInitializer } from "react-yandex-metrika";

interface props {
  children: ReactNode;
}

const YandexMetricaProvider = ({ children }: props) => <>{children}</>;

export default YandexMetricaProvider;
