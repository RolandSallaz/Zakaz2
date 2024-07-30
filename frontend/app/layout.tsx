import type { Metadata } from "next";
import { Jost } from "next/font/google";
import { ConfirmPopupProvider } from "./components/context/ConfirmPopupContext";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import "./globals.scss";
import InitialDataLoader from "./lib/redux/InitialDataLoader";
import ReduxProvider from "./lib/redux/StoreProvider";
import YandexMetricaProvider from "./components/YandexMetricaProvider"; // Импортируем YandexMetricaProvider

const jost = Jost({ weight: ["400", "500", "600"], subsets: ["cyrillic"] });

export const metadata: Metadata = {
  title: "BlinkResale: Эксклюзивная одежда от топовых мировых брендов",
  description: "Твой эксклюзивный образ от топовых мировых брендов",
  keywords:
    "BlinkResale, магазин одежды, эксклюзивная одежда, мировые бренды, стильная одежда, модный образ",
  authors: [{ name: "https://t.me/RSallaz" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isProduction = process.env.NODE_ENV === "production";

  return (
    <html lang="ru">
      <body className={`${jost.className}`}>
        <ConfirmPopupProvider>
          <ReduxProvider>
            {isProduction ? (
              <YandexMetricaProvider>
                <Header />
                <h1 className={"hidden_seo"}>
                  Обновите свой гардероб с BlinkResale: Эксклюзивная одежда от
                  топовых мировых брендов для создания вашего неповторимого и
                  стильного образа
                </h1>
                {children}
                <Footer />
                <InitialDataLoader />
              </YandexMetricaProvider>
            ) : (
              <>
                <Header />
                {children}
                <Footer />
                <InitialDataLoader />
              </>
            )}
          </ReduxProvider>
        </ConfirmPopupProvider>
      </body>
    </html>
  );
}
