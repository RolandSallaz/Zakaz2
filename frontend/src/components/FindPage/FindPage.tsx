import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';
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
    const filteredByGender =
      selectedGender.value !== '*'
        ? items.filter(
            (item) =>
              item.gender === selectedGender.value || item.gender === 'unisex',
          )
        : items;

    setFilteredItems(
      filteredByGender.filter(
        (item) =>
          item.name.toLowerCase().includes(value) ||
          item.gender.toLowerCase().includes(value) ||
          item.description.toLowerCase().includes(value) ||
          item.type.toLowerCase().includes(value),
      ),
    );
  }, [selectedGender, inputValue, items, searchParams, setSearchParams]);

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
