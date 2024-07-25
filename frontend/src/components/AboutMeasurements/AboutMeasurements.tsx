import AboutPage from '../AboutPage/AboutPage';
import './AboutMeasurements.scss';
import tshirt1 from '../../assets/measurements/tshirt1.jpg';
import tshirt2 from '../../assets/measurements/tshirt2.jpg';
import short1 from '../../assets/measurements/short1.jpg';
import short2 from '../../assets/measurements/short2.jpg';
import pants1 from '../../assets/measurements/pants1.jpg';
import pants2 from '../../assets/measurements/pants2.jpg';
import shoes1 from '../../assets/measurements/shoes1.jpg';
import shoes2 from '../../assets/measurements/shoes2.jpg';
import shoes3 from '../../assets/measurements/shoes3.jpg';
import jacket1 from '../../assets/measurements/jacket1.jpg';
import jacket2 from '../../assets/measurements/jacket2.jpg';
import jacket3 from '../../assets/measurements/jacket3.jpg';
import jacket4 from '../../assets/measurements/jacket4.jpg';
import jacket5 from '../../assets/measurements/jacket5.jpg';
import { Link } from 'react-router-dom';
export default function AboutMeasurements() {
  return (
    <AboutPage>
      <h2 className="AboutOrder__heading">Замеры.</h2>
      <p className="AboutOrder__text">
        Для того, чтобы правильно подобрать размер мы советуем всегда заказывать
        вещи по индивидуальным размерам. Эти замеры необходимо скинуть нашему
        менеджеру, чтобы перед заказом он помог вам с выбором нужного размера.
        <br />
        Футболка: <br /> - полуобхват груди
        <br /> - длину по спине
      </p>
      <div className="AboutOrder__grid">
        <img className="AboutOrder__grid-item" src={tshirt1} />
        <img className="AboutOrder__grid-item" src={tshirt2} />
      </div>
      <p className="AboutOrder__text">
        Шорты:
        <br /> - длина штанины
        <br /> - ширина по талии
      </p>
      <div className="AboutOrder__grid">
        <img className="AboutOrder__grid-item" src={short1} />
        <img className="AboutOrder__grid-item" src={short2} />
      </div>
      <p className="AboutOrder__text">
        Штаны:
        <br />- длина штанины
        <br />- ширина по талии
      </p>
      <div className="AboutOrder__grid">
        <img className="AboutOrder__grid-item" src={pants1} />
        <img className="AboutOrder__grid-item" src={pants2} />
      </div>
      <p className="AboutOrder__text">
        Любая обувь:
        <br />- длина стельки
      </p>
      <div className="AboutOrder__grid">
        <img className="AboutOrder__grid-item" src={shoes1} />
        <img className="AboutOrder__grid-item" src={shoes2} />
        <img className="AboutOrder__grid-item" src={shoes3} />
      </div>
      <p className="AboutOrder__text">
        Куртка (или любая вещь с длинными рукавами):
        <br />- ширина плеч
        <br />- длина рукава
        <br />- полуобхват груди
        <br />- длина
      </p>
      <div className="AboutOrder__grid">
        <img className="AboutOrder__grid-item" src={jacket1} />
        <img className="AboutOrder__grid-item" src={jacket2} />
        <img className="AboutOrder__grid-item" src={jacket3} />
        <img className="AboutOrder__grid-item" src={jacket4} />
        <img className="AboutOrder__grid-item" src={jacket5} />
      </div>
      <p className="AboutOrder__text">
        Все замеры необходимо делать на той вещи, которая больше всего похожа по
        фасону на то, что вы хотите заказать В этом случае вещь приедет и
        обязательно подойдет вам 👍
      </p>
      <Link className="link AboutOrder__back-link" to="/">
        Вернуться на главную
      </Link>
    </AboutPage>
  );
}
