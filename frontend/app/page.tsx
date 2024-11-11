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
import Link from "next/link";
import Pagination from "./components/Pagination/Pagination";
import maleImage from './lib/assets/male.jpg';
import femaleImage from './lib/assets/female.jpg';
export type mainFilter = "male" | "female" | "all" | "new";

export default function Home() {
  const [items, setItems] = useState<IItem[]>([]);
  const { main_heading } = useAppSelector((state) => state.appSlice);
  const [columnsCount, setColumnsCount] = useState<number>(0);
  const [selectedFilter, setSelectedFilter] = useState<mainFilter>("new");
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
          image={femaleImage.src}
          description="Товары лучше качества для нашей прекрасной половины"
          param={{ name: "gender", value: "female" }}
        />
        <FilterCard
          text="Мужское"
          image={maleImage.src}
          description="Только самые новые и стильные
          коллекции"
          param={{ name: "gender", value: "male" }}
        />
      </section>
      <section className={styles.tags}>
        <div
          className={`${styles.tags__container} ${styles.tags__container_left}`}
        >
          {/* <button
            className={`${styles.tags__button} ${selectedFilter === "all" ? styles.tags__button_active : ""
              }`}
            onClick={() => setSelectedFilter("all")}
          >
            Все
          </button> */}
          <button
            className={`${styles.tags__button} ${selectedFilter === "new" ? styles.tags__button_active : ""
              }`}
            onClick={() => setSelectedFilter("new")}
          >
            Новое
          </button>
          <Link href={'find?gender=male'}
            className={`${styles.tags__button} ${selectedFilter === "male" ? styles.tags__button_active : ""
              }`}
          // onClick={() => setSelectedFilter("male")}
          >
            Он
          </Link>
          <Link href={'find?gender=female'}
            className={`${styles.tags__button} ${selectedFilter === "female" ? styles.tags__button_active : ""
              }`}
          // onClick={() => setSelectedFilter("female")}
          >
            Она
          </Link>
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
      <Pagination totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
    </main>
  );
}
