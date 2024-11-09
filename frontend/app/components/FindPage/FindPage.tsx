"use client";
import useErrorHandler from "@/app/lib/hooks/useErrorHandler";
import { ApiGetItemsBySearch, ApiGetTypeSelectors } from "@/app/lib/utils/api";
import { IItem, ISelect } from "@/app/lib/utils/types";
import { debounce } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
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
  // const { data: items } = useAppSelector((state) => state.itemSlice);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const inputValue = watch("find");
  const [selectedGender, setSelectedGender] = useState<ISelect>(selectOptions[0]);
  const [selectedType, setSelectedType] = useState<ISelect>(defaultTypeSelector);
  const [selectedTypeOptions, setSelectedTypeOptions] = useState<ISelect[]>([]);
  const { handleError } = useErrorHandler();
  const isMobile = useMediaQuery({ maxWidth: 1279 });
  const [page, setPage] = useState<number>(1);
  const [results, setResults] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const paramValue = searchParams.get("search") || "";

    const paramGender = searchParams.get("gender") || "*";
    const paramPage = Number(searchParams.get("page")) || 1;
    setPage(paramPage);
    setValue("find", paramValue == 'undefined' ? '' : paramValue);
    setSelectedGender(
      selectOptions.find((item) => item.value === paramGender) || selectOptions[0]
    );
  }, [searchParams, setValue]);

  const updateQueryParams = useCallback(
    (params: Record<string, string>) => {
      const searchParams = new URLSearchParams(window.location.search);
      Object.entries(params).forEach(([key, value]) => {
        searchParams.set(key, value);
      });
      router.push(`${window.location.pathname}?${searchParams.toString()}`);
    },
    [router]
  );

  useEffect(() => {
    updateQueryParams({
      gender: selectedGender.value,
      search: inputValue,
      type: selectedType.value,
      page: page.toString(),
    });
  }, [selectedGender, selectedType, inputValue, updateQueryParams, page]);

  const handleChangeSelect = (newValue: SingleValue<ISelect>) => {
    setSelectedGender(newValue as ISelect);
  };

  useEffect(() => {
    ApiGetTypeSelectors()
      .then((options) => {
        const fetchedOptions: ISelect[] = options.map(
          (item) => ({ label: item.name, value: item.name } as ISelect)
        );
        setSelectedTypeOptions([defaultTypeSelector, ...fetchedOptions]);
      })
      .catch(handleError);
  }, [handleError]);

  useEffect(() => {
    setIsLoading(true);

    // Оборачиваем ApiGetItemsBySearch в debounce
    const debouncedSearch = debounce(() => {
      ApiGetItemsBySearch({
        find: inputValue,
        gender: selectedGender.value == '*' ? '' : selectedGender.value,
        type: selectedType.value == '*' ? '' : selectedType.value,
        page,
      })
        .then((res) => {
          setFilteredItems(res.items)
          setResults(res.totalItems)
          setTotalPages(res.totalPages)
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
    setPage(newPage)
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
          defaultValue={selectOptions[0]}
          onChange={handleChangeSelect}
          value={selectedGender}
          isSearchable={false}
          styles={{ menu: base => ({ ...base, zIndex: 9999 }) }}
        />
        <Select
          className="FindPage__select"
          value={selectedType}
          options={selectedTypeOptions}
          onChange={handleChangeTypeSelect}
          isSearchable={false}
          styles={{ menu: base => ({ ...base, zIndex: 9999 }) }}
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
      {totalPages > 0 && !isLoading && <Pagination totalPages={totalPages} currentPage={page} handlePageChange={handlePageChange} />}
    </main>
  );
}
