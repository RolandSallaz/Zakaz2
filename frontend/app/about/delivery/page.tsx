import AboutPage from "@/app/components/AboutPage/AboutPage";

export default function page() {
  return (
    <AboutPage>
      <h2 className="AboutOrder__heading">Доставка</h2>
      <p className="AboutOrder__text">
        На данный момент есть 2 варианта доставки:
      </p>
      <p className="AboutOrder__text">
        1. Стандартный
        Цена: бесплатно.
        Срок доставки: 14-20 дней
      </p>
      <p className="AboutOrder__text">
        2. Экспресс
        Цена: 2500₽ за 1кг
        Срок доставки: 1-3дня
      </p>
      <p className="AboutOrder__text">
        ‼️Внимание‼️
        Срок доставки указаны с момента отправки вещей со склада в Китае, после того, как вы подтвердите вещь на фотоотчете. Срок доставки ориентировочный, уточняйте состояние доставки перед заказом.
      </p>
    </AboutPage>
  );
}
