"use client";
import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Cards from "./components/Cards/Cards";
import FilterCard from "./components/FilterCard.tsx/FilterCard";
import { useAppSelector } from "./lib/redux/store";
import { IItem } from "./lib/utils/types";
import styles from "./page.module.scss";
import { Hearts } from "react-loader-spinner";
import { ApiGetItemsWithPage } from "./lib/utils/api";
import useErrorHandler from "./lib/hooks/useErrorHandler";
export type mainFilter = "male" | "female" | "all" | "new";

export default function Home() {
  const [items, setItems] = useState<IItem[]>([]);
  const { main_heading } = useAppSelector((state) => state.appSlice);
  const [columnsCount, setColumnsCount] = useState<number>(0);
  const [selectedFilter, setSelectedFilter] = useState<mainFilter>("all");
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const isMobile = useMediaQuery({ maxWidth: 1279 });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { handleError } = useErrorHandler();
  // Общее количество страниц
  const [totalPages, setTotalPages] = useState<number>(0);
  useEffect(() => {
    changeMainFilter(selectedFilter);
    if (items) {
      setIsLoading(false);
    }
  }, [items, selectedFilter]);

  useEffect(() => {
    setColumnsCount(isMobile ? 2 : 4);
  }, [isMobile]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    ApiGetItemsWithPage({ filter: selectedFilter, page: currentPage }).then((res) => {
      setFilteredItems(res.items)
      setTotalPages(res.totalPages)
    }).catch(handleError)
  }, [currentPage])

  function changeMainFilter(filter: mainFilter) {
    ApiGetItemsWithPage({ filter, itemsInPage: itemsPerPage }).then((res) => {
      setFilteredItems(res.items);
      setTotalPages(res.totalPages)
      setCurrentPage(1);
    }).catch(handleError)
  }

  const getPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <main className={`main ${styles.main}`}>
      {main_heading && <h2 className={styles.main__heading}>{main_heading}</h2>}
      <section className={styles.main__filters}>
        <FilterCard
          text="Женское"
          image="https://shilliano.su/wp-content/uploads/2022/10/%D0%91%D0%B5%D0%B7-%D0%B8%D0%BC%D0%B5%D0%BD%D0%B8-13-1.png"
          description="Теперь можешь порадовать не только
          себя но и свою подругу ♥️"
          param={{ name: "gender", value: "female" }}
        />
        <FilterCard
          text="Мужское"
          image="https://img.joomcdn.net/9a8eebbe42af8198669cf87967b8dadbaa02e70b_original.jpeg"
          description="Только самые новые и стильные
          коллекции в нашем магазине"
          param={{ name: "gender", value: "male" }}
        />
      </section>
      <section className={styles.tags}>
        <div
          className={`${styles.tags__container} ${styles.tags__container_left}`}
        >
          <button
            className={`${styles.tags__button} ${selectedFilter === "all" ? styles.tags__button_active : ""
              }`}
            onClick={() => setSelectedFilter("all")}
          >
            Все
          </button>
          <button
            className={`${styles.tags__button} ${selectedFilter === "new" ? styles.tags__button_active : ""
              }`}
            onClick={() => setSelectedFilter("new")}
          >
            Новое
          </button>
          <button
            className={`${styles.tags__button} ${selectedFilter === "male" ? styles.tags__button_active : ""
              }`}
            onClick={() => setSelectedFilter("male")}
          >
            Он
          </button>
          <button
            className={`${styles.tags__button} ${selectedFilter === "female" ? styles.tags__button_active : ""
              }`}
            onClick={() => setSelectedFilter("female")}
          >
            Она
          </button>
        </div>
        <div
          className={`${styles.tags__container} ${styles.tags__container_right}`}
        >
          <button
            className={`${styles.tags__button} ${columnsCount === (isMobile ? 1 : 2)
              ? styles.tags__button_active
              : ""
              }`}
            onClick={() => setColumnsCount(isMobile ? 1 : 2)}
          >
            {isMobile ? "l" : "ll"}
          </button>
          <button
            className={`${styles.tags__button} ${columnsCount === (isMobile ? 2 : 4)
              ? styles.tags__button_active
              : ""
              }`}
            onClick={() => setColumnsCount(isMobile ? 2 : 4)}
          >
            {isMobile ? "ll" : "llll"}
          </button>
        </div>
      </section>
      {isLoading ? (
        <Hearts
          height="160"
          width="160"
          color="#f03535"
          ariaLabel="Загрука"
          wrapperClass="ItemPage__loading"
          visible={true}
        />
      ) : (
        <Cards
          items={filteredItems}
          columnsCount={columnsCount}
          type={columnsCount < (isMobile ? 2 : 4) ? "big" : "default"}
        />
      )}

      <div className={styles.pagination}>
        {/* Кнопка "Предыдущая" */}
        {totalPages > 0 && (
          <button
            className={styles.pagination__button}
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
            className={`${styles.pagination__button} ${currentPage === number ? styles.pagination__button_active : ""
              }`}
            onClick={() =>
              typeof number === "number" && handlePageChange(number)
            }
            disabled={typeof number !== "number"}
          >
            {number}
          </button>
        ))}

        {/* Кнопка "Следующая" */}
        {totalPages > 0 && (
          <button
            className={styles.pagination__button}
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
