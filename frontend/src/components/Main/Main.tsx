import Card from '../Card/Card';
import FilterCard from '../FilterCard/FilterCard';
import './Main.scss';
export default function Main() {
  return (
    <main className="main">
      <h1 className="main__heading">Магазин крутой одежды</h1>
      <section className="main__filters">
        <FilterCard
          text="Женское"
          image="https://shilliano.su/wp-content/uploads/2022/10/%D0%91%D0%B5%D0%B7-%D0%B8%D0%BC%D0%B5%D0%BD%D0%B8-13-1.png"
          description="Теперь можешь порадовать не только
          себя но и свою подругу ♥️"
        />
        <FilterCard
          text="Мужское"
          image="https://img.joomcdn.net/9a8eebbe42af8198669cf87967b8dadbaa02e70b_original.jpeg"
          description="Только самые новые и стильные
          коллекции в нашем магазине"
        />
      </section>
      <section className="tags">
        <div className="tags__container tags__container_left">
          <button className="tags__button">Нов</button>
          <button className="tags__button">Он</button>
          <button className="tags__button">Она</button>
        </div>
        <div className="tags__container tags__container_right">
          <button className="tags__button">Столб.</button>
          <button className="tags__button">Фильтр</button>
        </div>
      </section>
      <section className="cards">
        <Card
          image="https://sun9-31.userapi.com/impg/8MG-8A5o_wOWzCQXn5W_AlKifW4ibc2z95ZHRA/EKElRvrL-jw.jpg?size=663x960&quality=95&sign=68299af96c1ad8a81f72a2171e4c6383&type=album"
          secondImage="https://sun9-39.userapi.com/impg/WAdkfYqc2P8hDvQXwTzLrelCbkC9phv09q4x0g/XbWUNfv6K2I.jpg?size=1303x1920&quality=95&sign=ec9ab42cd7674019b60d16006b24980c&type=album"
        />
        <Card
          image="https://sun9-31.userapi.com/impg/8MG-8A5o_wOWzCQXn5W_AlKifW4ibc2z95ZHRA/EKElRvrL-jw.jpg?size=663x960&quality=95&sign=68299af96c1ad8a81f72a2171e4c6383&type=album"
          secondImage="https://sun9-39.userapi.com/impg/WAdkfYqc2P8hDvQXwTzLrelCbkC9phv09q4x0g/XbWUNfv6K2I.jpg?size=1303x1920&quality=95&sign=ec9ab42cd7674019b60d16006b24980c&type=album"
        />
        <Card
          image="https://sun9-31.userapi.com/impg/8MG-8A5o_wOWzCQXn5W_AlKifW4ibc2z95ZHRA/EKElRvrL-jw.jpg?size=663x960&quality=95&sign=68299af96c1ad8a81f72a2171e4c6383&type=album"
          secondImage="https://sun9-39.userapi.com/impg/WAdkfYqc2P8hDvQXwTzLrelCbkC9phv09q4x0g/XbWUNfv6K2I.jpg?size=1303x1920&quality=95&sign=ec9ab42cd7674019b60d16006b24980c&type=album"
        />
        <Card
          image="https://sun9-31.userapi.com/impg/8MG-8A5o_wOWzCQXn5W_AlKifW4ibc2z95ZHRA/EKElRvrL-jw.jpg?size=663x960&quality=95&sign=68299af96c1ad8a81f72a2171e4c6383&type=album"
          secondImage="https://sun9-39.userapi.com/impg/WAdkfYqc2P8hDvQXwTzLrelCbkC9phv09q4x0g/XbWUNfv6K2I.jpg?size=1303x1920&quality=95&sign=ec9ab42cd7674019b60d16006b24980c&type=album"
        />
        <Card
          image="https://sun9-31.userapi.com/impg/8MG-8A5o_wOWzCQXn5W_AlKifW4ibc2z95ZHRA/EKElRvrL-jw.jpg?size=663x960&quality=95&sign=68299af96c1ad8a81f72a2171e4c6383&type=album"
          secondImage="https://sun9-39.userapi.com/impg/WAdkfYqc2P8hDvQXwTzLrelCbkC9phv09q4x0g/XbWUNfv6K2I.jpg?size=1303x1920&quality=95&sign=ec9ab42cd7674019b60d16006b24980c&type=album"
        />
      </section>
    </main>
  );
}
