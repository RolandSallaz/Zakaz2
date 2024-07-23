import { useEffect, useState } from 'react';
import { useSelector } from '../../services/store';
import Cards from '../Cards/Cards';
import FilterCard from '../FilterCard/FilterCard';
import './Main.scss';
import { IItem } from '../../utils/types';

type mainFilter = 'male' | 'female' | 'all' | 'new';

export default function Main() {
  const { data: items } = useSelector((state) => state.itemSlice);
  const { main_heading } = useSelector((state) => state.appSlice);
  const [columnsCount, setColumnsCount] = useState<number>(4);
  const [selectedFilter, setSelectedFilter] = useState<mainFilter>('all');
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);

  useEffect(() => {
    changeMainFilter(selectedFilter);
  }, [items, selectedFilter]);

  function changeMainFilter(filter: mainFilter) {
    if (filter == 'new') {
      setFilteredItems(
        items.filter((item) => {
          const today = new Date();
          const weekAgo = new Date(today.setDate(today.getDate() - 7));
          const itemDate = new Date(item.start_sell_date);
          return itemDate > weekAgo;
        }),
      );
    } else if (filter == 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter(
          (item) => item.gender == filter || item.gender == 'unisex',
        ),
      );
    }
  }

  return (
    <main className="main">
      {/* <h1>toDo seo</h1> */}
      {main_heading && <h2 className="main__heading">{main_heading}</h2>}
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
          <button
            className={`tags__button ${selectedFilter == 'all' && 'tags__button_active'}`}
            onClick={() => setSelectedFilter('all')}
          >
            Все
          </button>
          <button
            className={`tags__button ${selectedFilter == 'new' && 'tags__button_active'}`}
            onClick={() => setSelectedFilter('new')}
          >
            Новое
          </button>
          <button
            className={`tags__button ${selectedFilter == 'male' && 'tags__button_active'}`}
            onClick={() => setSelectedFilter('male')}
          >
            Он
          </button>
          <button
            className={`tags__button ${selectedFilter == 'female' && 'tags__button_active'}`}
            onClick={() => setSelectedFilter('female')}
          >
            Она
          </button>
        </div>
        <div className="tags__container tags__container_right">
          <button
            className={`tags__button ${columnsCount == 2 && 'tags__button_active'}`}
            onClick={() => setColumnsCount(2)}
          >
            ll
          </button>
          <button
            className={`tags__button ${columnsCount == 4 && 'tags__button_active'}`}
            onClick={() => setColumnsCount(4)}
          >
            llll
          </button>
        </div>
      </section>
      <Cards
        items={filteredItems}
        columnsCount={columnsCount}
        type={columnsCount < 4 ? 'big' : 'default'}
      />
    </main>
  );
}
