import AboutPage from "@/app/components/AboutPage/AboutPage";

export default function AboutHowToOrder() {
  return (
    <AboutPage>
      <h2 className="AboutOrder__heading">Как заказать?</h2>
      <p className="AboutOrder__text">
        Сделайте скриншоты тех вещей, которые вам понравились и скиньте их
        менеджеру{" "}
        <a
          className="link AboutOrder__link"
          href="https://t.me/blinkmanager"
          target="_blank"
        >
          t.me/blinkmanager
        </a>
        , а он уже поможет вам подобрать нужный размер и сделать заказ
      </p>
    </AboutPage>
  );
}
