"use client";
import useErrorHandler from "@/app/lib/hooks/useErrorHandler";
import { useAppSelector } from "@/app/lib/redux/store";
import { ApiGetTypeSelectors } from "@/app/lib/utils/api";
import { ISelect, IItem } from "@/app/lib/utils/types";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, Suspense, FocusEvent } from "react";
import { useForm } from "react-hook-form";
import { useMediaQuery } from "react-responsive";
import { SingleValue } from "react-select";
import Select from "react-select";
import Cards from "../Cards/Cards";
import { Hearts } from "react-loader-spinner";
import "./FindPage.scss";
import Layout from "@/app/admin/layout";
const selectOptions = [
  { value: "*", label: "Все" },
  // { value: "unisex", label: "Унисекс" },
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
  const { data: items } = useAppSelector((state) => state.itemSlice);
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const inputValue = watch("find");
  const [selectedGender, setSelectedGender] = useState<ISelect>(
    selectOptions[0]
  );
  const [selectedType, setSelectedType] =
    useState<ISelect>(defaultTypeSelector);
  const [selectedTypeOptions, setSelectedTypeOptions] = useState<ISelect[]>([]);
  const { handleError } = useErrorHandler();
  const isMobile = useMediaQuery({ maxWidth: 1279 });

  useEffect(() => {
    window.scrollTo(0, 0);
    const paramValue = searchParams.get("search") || "";
    const paramGender = searchParams.get("gender") || "*";
    const paramType = searchParams.get("type");

    if (paramType) {
      setSelectedType({ value: paramType, label: paramType });
    }

    setValue("find", paramValue);
    setSelectedGender(
      selectOptions.find((item) => item.value === paramGender) ||
      selectOptions[0]
    );
  }, [searchParams, setValue]);

  useEffect(() => {
    const value = String(inputValue).toLowerCase();
    const filteredByType =
      selectedType.value !== "*"
        ? items.filter((item) => item.type == selectedType.value)
        : items;

    const filteredByGender =
      selectedGender.value !== "*"
        ? filteredByType.filter(
          (item) =>
            item.gender === selectedGender.value || item.gender === "unisex"
        )
        : filteredByType;

    setFilteredItems(
      filteredByGender.filter(
        (item) =>
          item.name.toLowerCase().includes(value) ||
          item.gender.toLowerCase().includes(value) ||
          item.description.toLowerCase().includes(value) ||
          item.type.toLowerCase().includes(value)
      )
    );
    updateQueryParams("gender", selectedGender.value);
  }, [selectedGender, selectedType, inputValue, items, searchParams]);

  const updateQueryParams = useCallback(
    (paramName: string, value: string) => {
      // Создаем объект URLSearchParams из текущего URL
      const searchParams = new URLSearchParams(window.location.search);

      // Обновляем параметр запроса
      searchParams.set(paramName, value);

      // Обновляем URL с новыми параметрами
      router.push(`${window.location.pathname}?${searchParams.toString()}`);
    },
    [router]
  );
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
  }, []);

  const handleChangeTypeSelect = (selected: ISelect | null) => {
    if (selected) {
      setSelectedType(selected);
    }
  };


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
        />
        <Select
          className="FindPage__select"
          value={selectedType}
          options={selectedTypeOptions}
          onChange={handleChangeTypeSelect}
          isSearchable={false}
        />
      </div>

      {isDirty && <p>Результатов: {filteredItems.length}</p>}
      {items.length > 0 ? (
        <Cards items={filteredItems} columnsCount={isMobile ? 2 : 4} />
      ) : (
        <Hearts
          height="160"
          width="160"
          color="#f03535"
          ariaLabel="Загрука"
          wrapperClass="ItemPage__loading"
          visible={true}
        />
      )}
    </main>
  );
}
