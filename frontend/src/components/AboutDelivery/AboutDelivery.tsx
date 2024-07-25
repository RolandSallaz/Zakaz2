import AboutPage from '../AboutPage/AboutPage';

export default function AboutDelivery() {
  return (
    <AboutPage>
      <h2 className="AboutOrder__heading">Доставка</h2>
      <p className="AboutOrder__text">
        На данный момент есть 2 варианта доставки
        <br />- авто (стандарт)
        <br />
        Цена: входим в стоимость
        <br />
        Срок: от 14 до 20 дней
        <br />- авиа (экспресс)
        <br />
        Цена: 2.500₽ за кг
        <br />
        Срок: 1-3 дня
        <br />
        Сроки указаны с момента получения вещи на складе в Китае до Москвы
      </p>
    </AboutPage>
  );
}
