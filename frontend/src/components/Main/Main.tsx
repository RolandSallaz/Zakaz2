import { useSelector } from '../../services/store';
import Cards from '../Cards/Cards';
import FilterCard from '../FilterCard/FilterCard';
import './Main.scss';
export default function Main() {
  const { data: items } = useSelector((state) => state.itemSlice);
  return (
    <main className="main">
      <h1 className="main__heading">Магазин крутой одежды</h1>
      <section className="main__filters">
        <FilterCard
          text="Женское"
          image="https://shilliano.su/wp-content/uploads/2022/10/%D0%91%D0%B5%D0%B7-%D0%B8%D0%BC%D0%B5%D0%BD%D0%B8-13-1.png"
          description="Теперь можешь порадовать не только
          себя но и свою подругу ♥️"
          param={{ name: 'gender', value: 'female' }}
        />
        <FilterCard
          text="Мужское"
          image="https://img.joomcdn.net/9a8eebbe42af8198669cf87967b8dadbaa02e70b_original.jpeg"
          description="Только самые новые и стильные
          коллекции в нашем магазине"
          param={{ name: 'gender', value: 'male' }}
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
      <Cards items={items} />
    </main>
  );
}
