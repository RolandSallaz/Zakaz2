"use client";
import useErrorHandler from "@/app/lib/hooks/useErrorHandler";
import { ApiGetItemsBySearch, ApiGetTypeSelectors } from "@/app/lib/utils/api";
import { IItem, ISelect } from "@/app/lib/utils/types";
import { debounce } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Hearts } from "react-loader-spinner";
import { useMediaQuery } from "react-responsive";
import Select, { SingleValue } from "react-select";
import Cards from "../Cards/Cards";
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

const defaultTypeSelector: ISelect = { value: "*", label: "Все типы" };

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
  const [selectedGender, setSelectedGender] = useState<ISelect>(selectOptions[0]);
  const [selectedType, setSelectedType] = useState<ISelect>(selectTypes[0]);
  // const [selectedTypeOptions, setSelectedTypeOptions] = useState<ISelect[]>(selectTypes);
  const { handleError } = useErrorHandler();
  const isMobile = useMediaQuery({ maxWidth: 1279 });
  const [page, setPage] = useState<number>(1);
  const [results, setResults] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Восстановление фильтров из sessionStorage
  useEffect(() => {
    window.scrollTo(0, 0);
    const savedFilters = JSON.parse(sessionStorage.getItem("findPageFilters") || "{}");
    const paramValue = searchParams.get("search") || "";
    const paramGender = searchParams.get("gender") || "*";
    const paramType = searchParams.get("type") || "*";
    const paramPage = Number(searchParams.get("page")) || 1;
    if (initial) {
      setPage(paramPage);
      setValue("find", paramValue === "undefined" ? "" : paramValue);
      setSelectedGender(selectOptions.find((item) => item.value === paramGender) || selectOptions[0]);
      setSelectedType(selectTypes.find((item) => item.value === paramType) || selectTypes[0]);
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
        gender: selectedGender.value,
        search: inputValue,
        type: selectedType.value,
        page: page.toString(),
      });
    }

  }, [selectedGender, selectedType, inputValue, updateQueryParams, page]);

  const handleChangeSelect = (newValue: SingleValue<ISelect>) => {
    setSelectedGender(newValue as ISelect);
  };

  // useEffect(() => {
  //   ApiGetTypeSelectors()
  //     .then((options) => {
  //       const fetchedOptions: ISelect[] = options.map(
  //         (item) => ({ label: item.name, value: item.name } as ISelect)
  //       );
  //       setSelectedTypeOptions([defaultTypeSelector, ...fetchedOptions]);
  //     })
  //     .catch(handleError);
  // }, [handleError]);

  useEffect(() => {
    setIsLoading(true);

    // Оборачиваем ApiGetItemsBySearch в debounce
    const debouncedSearch = debounce(() => {
      ApiGetItemsBySearch({
        find: inputValue,
        gender: selectedGender.value === "*" ? "" : selectedGender.value,
        type: selectedType.value === "*" ? "" : selectedType.value,
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
  }, [inputValue, selectedGender, selectedType, page]);

  const handleChangeTypeSelect = (selected: ISelect | null) => {
    if (selected) {
      setSelectedType(selected);
    }
  };

  function handlePageChange(newPage: number) {
    setPage(newPage);
  }

  return (
    <main className="main FindPage">
      <div className="FindPage__container">
        <input
          className="FindPage__input"
          placeholder="Поиск"
          {...register("find", { minLength: 2 })}
        />
        <Select
          className="FindPage__select"
          options={selectOptions}
          value={selectedGender}
          onChange={handleChangeSelect}
          isSearchable={false}
          styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
        />
        <Select
          className="FindPage__select"
          value={selectedType}
          options={selectTypes}
          onChange={handleChangeTypeSelect}
          isSearchable={false}
          styles={{ menu: (base) => ({ ...base, zIndex: 9999 }) }}
        />
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
        <Cards items={filteredItems} columnsCount={isMobile ? 2 : 4} />
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
