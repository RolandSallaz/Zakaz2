import FooterColumn from '../FooterColumn/FooterColumn';
import './Footer.scss';

export default function Footer() {
  const date = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer__columns">
        <FooterColumn
          heading="Клиенту"
          children={
            <>
              <a className="footerColumn__link" href="#">
                Мой аккаунт
              </a>
              <a className="footerColumn__link" href="#">
                Каталог
              </a>
              <a className="footerColumn__link" href="#">
                Оформление заказа
              </a>
              <a className="footerColumn__link" href="#">
                Отслеживание заказа
              </a>
              <a className="footerColumn__link" href="#">
                Избранное
              </a>
            </>
          }
        />
        <FooterColumn
          heading="Поддержка"
          children={
            <>
              <a className="footerColumn__link" href="#">
                Помощь покупателю
              </a>
              <a className="footerColumn__link" href="#">
                Доставка и возврат
              </a>
              <a className="footerColumn__link" href="#">
                Контакты
              </a>
              <a className="footerColumn__link" href="#">
                FAQs
              </a>
              <a className="footerColumn__link" href="#">
                Отзывы
              </a>
              <a className="footerColumn__link" href="#">
                Политика конфиденциальности
              </a>
            </>
          }
        />
        <FooterColumn
          heading="Поддержка"
          children={
            <>
              <a className="footerColumn__link" href="#">
                Помощь покупателю
              </a>
              <a className="footerColumn__link" href="#">
                Доставка и возврат
              </a>
              <a className="footerColumn__link" href="#">
                Контакты
              </a>
              <a className="footerColumn__link" href="#">
                FAQs
              </a>
              <a className="footerColumn__link" href="#">
                Отзывы
              </a>
              <a className="footerColumn__link" href="#">
                Политика конфиденциальности
              </a>
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
              <img
                className="footerColumn__image"
                src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Rickrolling_QR_code.png"
                alt="qr код на телеграмм"
              ></img>
            </>
          }
        />
      </div>
      <p className="footer__copyright">{`© ${date} ${import.meta.env.VITE_SHOP_NAME || 'название магазина'}. ALL RIGHTS RESERVED.`}</p>
    </footer>
  );
}
