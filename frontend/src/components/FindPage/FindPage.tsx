import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import Select, { SingleValue } from 'react-select';
import useErrorHandler from '../../hooks/useErrorHandler';
import { useSelector } from '../../services/store';
import { ApiGetTypeSelectors } from '../../utils/api';
import { IItem, ISelect } from '../../utils/types';
import Cards from '../Cards/Cards';
import './FindPage.scss';

const selectOptions = [
  { value: '*', label: 'Все' },
  { value: 'unisex', label: 'Унисекс' },
  { value: 'male', label: 'Мужское' },
  { value: 'female', label: 'Женское' },
];

const defaultTypeSelector: ISelect = { value: '*', label: 'Все типы' };

export default function FindPage() {
  const {
    formState: { isDirty },
    register,
    watch,
    setValue,
  } = useForm<{ find: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: items } = useSelector((state) => state.itemSlice);
  const [filteredItems, setFilteredItems] = useState<IItem[]>([]);
  const inputValue = watch('find');
  const [selectedGender, setSelectedGender] = useState<ISelect>(
    selectOptions[0],
  );
  const [selectedType, setSelectedType] =
    useState<ISelect>(defaultTypeSelector);
  const [selectedTypeOptions, setSelectedTypeOptions] = useState<ISelect[]>([]);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    window.scrollTo(0, 0);
    const paramValue = searchParams.get('search') || '';
    const paramGender = searchParams.get('gender') || '*';
    setValue('find', paramValue);
    setSelectedGender(
      selectOptions.find((item) => item.value === paramGender) ||
        selectOptions[0],
    );
  }, [searchParams, setValue]);

  useEffect(() => {
    const value = String(inputValue).toLowerCase();
    const filteredByType =
      selectedType.value !== '*'
        ? items.filter((item) => item.type == selectedType.value)
        : items;

    const filteredByGender =
      selectedGender.value !== '*'
        ? filteredByType.filter(
            (item) =>
              item.gender === selectedGender.value || item.gender === 'unisex',
          )
        : filteredByType;

    setFilteredItems(
      filteredByGender.filter(
        (item) =>
          item.name.toLowerCase().includes(value) ||
          item.gender.toLowerCase().includes(value) ||
          item.description.toLowerCase().includes(value) ||
          item.type.toLowerCase().includes(value),
      ),
    );
  }, [
    selectedGender,
    selectedType,
    inputValue,
    items,
    searchParams,
    setSearchParams,
  ]);

  const handleChangeSelect = (newValue: SingleValue<ISelect>) => {
    setSelectedGender(newValue as ISelect);
  };

  useEffect(() => {
    ApiGetTypeSelectors()
      .then((options) => {
        const fetchedOptions: ISelect[] = options.map(
          (item) => ({ label: item.name, value: item.name }) as ISelect,
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
          {...register('find', { minLength: 2 })}
        />
        <Select
          className="FindPage__select"
          options={selectOptions}
          defaultValue={selectOptions[0]}
          onChange={handleChangeSelect}
          value={selectedGender}
        />
        <Select
          className="FindPage__select"
          defaultValue={defaultTypeSelector}
          options={selectedTypeOptions}
          onChange={handleChangeTypeSelect}
        />
      </div>

      {isDirty && <p>Результатов: {filteredItems.length}</p>}
      <Cards items={filteredItems} />
    </main>
  );
}
