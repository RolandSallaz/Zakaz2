import FooterColumn from "../FooterColumn/FooterColumn";
import "./Footer.scss";
import tgImage from "../../lib/assets/telegram.png";
import Link from "next/link";

export default function Footer() {
  const date = new Date().getFullYear();
  return (
    <footer className="footer">
      <nav className="footer__columns">
        <FooterColumn heading="Клиенту">
          <>
            <Link className="link footerColumn__link" href="/profile">
              Мой аккаунт
            </Link>
            <Link className="link footerColumn__link" href="/likes">
              Избранное
            </Link>
            <Link
              className="link footerColumn__link"
              href="/about/measurements"
            >
              Замеры
            </Link>
            <Link className="link footerColumn__link" href="/about/delivery">
              Доставка
            </Link>
          </>
        </FooterColumn>
        <FooterColumn heading="Поддержка">
          <>
            <Link
              className="link footerColumn__link"
              href="/about/customer-help"
            >
              Помощь покупателю
            </Link>
            <Link className="link footerColumn__link" href="/about/order">
              Оформление заказа
            </Link>
            <a
              className="link footerColumn__link"
              target="_blank"
              href="https://t.me/blinkresale_reviews"
            >
              Отзывы
            </a>
          </>
        </FooterColumn>
        <FooterColumn heading="Мы в телеграм">
          <>
            <p className="footerColumn__text">
              Все самое интересное сначала появляется на нашем канале 👇
            </p>
            <a
              className="footerColumn__image"
              href="https://t.me/blink_resale"
              target="_blank"
            >
              <img src={tgImage.src} alt="qr код на телеграмм" />
            </a>
          </>
        </FooterColumn>
      </nav>
      <p className="footer__copyright">{`© 2020-${date} ${
        process.env.NEXT_PUBLIC_SHOP_NAME || "название магазина"
      }. ALL RIGHTS RESERVED.`}</p>
    </footer>
  );
}
