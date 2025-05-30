"use client";
import useErrorHandler from "@/app/lib/hooks/useErrorHandler";
import { useAppSelector } from "@/app/lib/redux/store";
import { ApiGetItemsBySearch } from "@/app/lib/utils/api";
import { IItem } from "@/app/lib/utils/types";
import { debounce } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Hearts } from "react-loader-spinner";
import { useMediaQuery } from "react-responsive";
import Cards from "../Cards/Cards";
import { CategoryTreeSelector } from "../CategoryTreeSelector/CategoryTreeSelector";
import ColumnsCount from "../ColumnsCount/ColumnsCount";
import Pagination from "../Pagination/Pagination";
import "./FindPage.scss";

const selectOptions = [
  { value: "*", label: "Все" },
  { value: "male", label: "Мужское" },
  { value: "female", label: "Женское" },
];

export const selectTypes = [
  { value: "*", label: "Все типы" },
  { value: "Сумки", label: "Сумки" },
  { value: "Обувь", label: "Обувь" },
  { value: "Одежда", label: "Одежда" },
  { value: "Аксессуары", label: "Аксессуары" },
  { value: "Техника", label: "Техника" },
  { value: "Для дома", label: "Для дома" },
]

export default function FindPage() {
  const {
    formState: { isDirty },
    register,
    watch,
    setValue,
  } = useForm<{ find: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [initial, setInitial] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const inputValue = watch("find");
  const { handleError } = useErrorHandler();
  const isMobile = useMediaQuery({ maxWidth: 1279 });
  const [page, setPage] = useState<number>(1);
  const [results, setResults] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [columnsCount, setColumnsCount] = useState<number>(0);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const { selectedPath: categoryFromMobile, isPopupOpened: isMobileCategoryOpened } = useAppSelector(state => state.searchCategorySlice)

  // Восстановление фильтров из sessionStorage
  useEffect(() => {
    window.scrollTo(0, 0);
    const paramValue = searchParams.get("search") || "";
    const paramPage = Number(searchParams.get("page")) || 1;
    const paramCategory = JSON.parse(searchParams.get("category") || '[]')
    if (initial) {
      setPage(paramPage);
      setValue("find", paramValue === "undefined" ? "" : paramValue);
      setSelectedCategory(paramCategory)
    }
    setInitial(false)

  }, [searchParams, setValue]);

  // Обновление URL-параметров и sessionStorage
  const updateQueryParams = useCallback(
    (params: Record<string, string>) => {
      const searchParams = new URLSearchParams(window.location.search);
      Object.entries(params).forEach(([key, value]) => {
        searchParams.set(key, value);
      });
      router.replace(`${window.location.pathname}?${searchParams.toString()}`);
      sessionStorage.setItem("findPageFilters", JSON.stringify(params));
    },
    [router]
  );

  useEffect(() => {
    if (!initial) {
      updateQueryParams({
        category: JSON.stringify(selectedCategory),
        search: inputValue,
        page: page.toString(),
      });
    }

  }, [selectedCategory, inputValue, updateQueryParams, page]);

  useEffect(() => {
    setIsLoading(true);

    // Оборачиваем ApiGetItemsBySearch в debounce
    const debouncedSearch = debounce(() => {
      ApiGetItemsBySearch({
        find: inputValue,
        category: selectedCategory,
        page,
        itemsInPage: 60,
      })
        .then((res) => {
          setFilteredItems(res.items);
          setResults(res.totalItems);
          setTotalPages(res.totalPages);
        })
        .catch(handleError)
        .finally(() => setIsLoading(false));
    }, 1000); // Задержка в 1000 мс (1 секунда)

    // Вызываем debounced функцию
    debouncedSearch();

    // Очищаем дебаунс, если компонента размонтируется
    return () => debouncedSearch.cancel();
  }, [inputValue, selectedCategory, page]);

  // const handleChangeTypeSelect = (selected: ISelect | null) => {
  //   if (selected) {
  //     setSelectedType(selected);
  //   }
  // };

  function handlePageChange(newPage: number) {
    setPage(newPage);
  }

  useEffect(() => {
    if (filteredItems) {
      const lastVisitedItem = sessionStorage.getItem('lastVisited')
      const item = filteredItems.find((i => i.id == Number(lastVisitedItem)));
      if (item) {
        const element = document.getElementById(item.id.toString());
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          sessionStorage.removeItem('lastVisited')
        }
      }
    }
  }, [filteredItems]);

  useEffect(() => {
    setColumnsCount(isMobile ? 2 : 4);
  }, [isMobile]);

  useEffect(() => {
    setSelectedCategory(categoryFromMobile);
  }, [categoryFromMobile])

  useEffect(() => {
    if (isMobileCategoryOpened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileCategoryOpened]);

  return (
    <main className="main FindPage">
      <div className="FindPage__container">
        <CategoryTreeSelector getValue={(value) => {
          setSelectedCategory(value);
        }} isMobile={isMobile} />
        <div className="FindPage__search-container">
          <input
            className="FindPage__input"
            placeholder="Поиск"
            {...register("find", { minLength: 2 })}
          />
          {isMobile && (<ColumnsCount isMobile={isMobile} columnsCount={columnsCount} setColumnsCount={setColumnsCount} />)}
        </div>

        {!isMobile && (<ColumnsCount isMobile={isMobile} columnsCount={columnsCount} setColumnsCount={setColumnsCount} style={{ height: '100%', paddingLeft: '14px', paddingRight: '14px' }} />)}
      </div>

      {isDirty && <p>Результатов: {results}</p>}
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
        <Cards items={filteredItems} columnsCount={columnsCount} />
      )}
      {totalPages > 0 && !isLoading && page !== totalPages && (
        <button className={"nextPage"} onClick={() => handlePageChange(page + 1)}>
          Следующая страница
        </button>
      )}
      {totalPages > 0 && !isLoading && (
        <Pagination totalPages={totalPages} currentPage={page} handlePageChange={handlePageChange} />
      )}
    </main>
  );
}
