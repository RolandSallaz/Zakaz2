import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import Select, { SingleValue } from 'react-select';
import { useSelector } from '../../services/store';
import { IItem, ISelect } from '../../utils/types';
import Cards from '../Cards/Cards';
import './FindPage.scss';

const selectOptions = [
  { value: '*', label: 'Все' },
  { value: 'unisex', label: 'Унисекс' },
  { value: 'male', label: 'Мужское' },
  { value: 'female', label: 'Женское' },
];

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

  useEffect(() => {
    const paramValue: string = searchParams.get('search') || '';
    const paramGender: string | null = searchParams.get('gender');
    setFilteredItems(items);
    setValue('find', paramValue);
    if (paramGender) {
      setSelectedGender(
        selectOptions.find((item) => item.value == paramGender)!,
      );
    }
    window.scrollTo(0, 0);
  }, [items]);

  useEffect(() => {
    const value = String(inputValue).toLowerCase();
    const filteredByGender: IItem[] =
      selectedGender !== selectOptions[0]
        ? items.filter(
            (item) =>
              item.gender == selectedGender.value || item.gender == 'unisex',
          )
        : items;
    setFilteredItems(
      filteredByGender.filter(
        (item) =>
          item.name.toLowerCase().startsWith(value) ||
          item.gender.toLowerCase().startsWith(value) ||
          item.description.toLowerCase().startsWith(value) ||
          item.type.toLowerCase().startsWith(value),
      ),
    );
    setSearchParams({ search: inputValue, gender: selectedGender.value });
  }, [selectedGender, inputValue, items, setSearchParams]);

  const handleChangeSelect = (newValue: SingleValue<ISelect>) => {
    setSelectedGender(newValue as ISelect);
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
      </div>

      {isDirty && <p>Результатов: {filteredItems.length}</p>}
      <Cards items={filteredItems} />
    </main>
  );
}
