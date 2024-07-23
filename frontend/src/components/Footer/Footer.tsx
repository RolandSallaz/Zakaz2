import { Link } from 'react-router-dom';
import FooterColumn from '../FooterColumn/FooterColumn';
import './Footer.scss';
import tgImage from '../../assets/telegram.png';

export default function Footer() {
  const date = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__columns">
        <FooterColumn
          heading="Клиенту"
          children={
            <>
              <Link className="footerColumn__link" to="/profile">
                Мой аккаунт
              </Link>
              <Link className="footerColumn__link" to="/about/order">
                Оформление заказа
              </Link>
              <Link className="footerColumn__link" to="/likes">
                Избранное
              </Link>
            </>
          }
        />
        <FooterColumn
          heading="Поддержка"
          children={
            <>
              <Link className="footerColumn__link" to="/about/customer-help">
                Помощь покупателю
              </Link>
              <Link
                className="footerColumn__link"
                to="/about/delivery-and-refund"
              >
                Доставка и возврат
              </Link>
              <Link className="footerColumn__link" to="/about/contacts">
                Контакты
              </Link>
              <a
                className="footerColumn__link"
                target="_blank"
                href="https://t.me/blinkresale_reviews"
              >
                Отзывы
              </a>
              <Link className="footerColumn__link" to="/about/privacy-policy">
                Политика конфиденциальности
              </Link>
            </>
          }
        />
        <FooterColumn
          heading="Мы в телеграм"
          children={
            <>
              <p className="footerColumn__text">
                Все самое интересное сначала появляется на нашем канале 👇
              </p>
              <a href="https://t.me/blink_resale" target="_blank">
                <img
                  className="footerColumn__image"
                  src={tgImage}
                  alt="qr код на телеграмм"
                />
              </a>
            </>
          }
        />
      </div>
      <p className="footer__copyright">{`© ${date} ${import.meta.env.VITE_SHOP_NAME || 'название магазина'}. ALL RIGHTS RESERVED.`}</p>
    </footer>
  );
}
