import { useEffect, useState } from 'react';
import { useSelector } from '../../services/store';
import Cards from '../Cards/Cards';
import FilterCard from '../FilterCard/FilterCard';
import './Main.scss';
import { IItem } from '../../utils/types';
import { useMediaQuery } from 'react-responsive';
type mainFilter = 'male' | 'female' | 'all' | 'new';

export default function Main() {
  const { data: items } = useSelector((state) => state.itemSlice);
  const { main_heading } = useSelector((state) => state.appSlice);
  const [columnsCount, setColumnsCount] = useState<number>(0);
  const [selectedFilter, setSelectedFilter] = useState<mainFilter>('all');
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const isMobile = useMediaQuery({ maxWidth: 1279 });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Общее количество страниц
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  useEffect(() => {
    changeMainFilter(selectedFilter);
  }, [items, selectedFilter]);

  useEffect(() => {
    setColumnsCount(isMobile ? 2 : 4);
  }, [isMobile]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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

  const getPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

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
            className={`tags__button ${columnsCount == (isMobile ? 1 : 2) && 'tags__button_active'}`}
            onClick={() => setColumnsCount(isMobile ? 1 : 2)}
          >
            {isMobile ? 'l' : 'll'}
          </button>
          <button
            className={`tags__button ${columnsCount == (isMobile ? 2 : 4) && 'tags__button_active'}`}
            onClick={() => setColumnsCount(isMobile ? 2 : 4)}
          >
            {isMobile ? 'll' : 'llll'}
          </button>
        </div>
      </section>
      <Cards
        items={currentItems}
        columnsCount={columnsCount}
        type={columnsCount < (isMobile ? 2 : 4) ? 'big' : 'default'}
      />
      <div className="pagination">
        {/* Кнопка "Предыдущая" */}
        {totalPages > 0 && (
          <button
            className="pagination__button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Назад
          </button>
        )}

        {/* Кнопки страниц */}
        {getPageNumbers().map((number, index) => (
          <button
            key={index}
            className={`pagination__button ${currentPage === number ? 'pagination__button_active' : ''}`}
            onClick={() =>
              typeof number === 'number' && handlePageChange(number)
            }
            disabled={typeof number !== 'number'}
          >
            {number}
          </button>
        ))}

        {/* Кнопка "Следующая" */}
        {totalPages > 0 && (
          <button
            className="pagination__button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Вперед
          </button>
        )}
      </div>
    </main>
  );
}
