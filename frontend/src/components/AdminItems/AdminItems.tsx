import { useEffect, useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import Select, {
  MenuProps,
  MultiValue,
  SingleValue,
  components,
} from 'react-select';
import useErrorHandler from '../../hooks/useErrorHandler';
import { openSnackBar } from '../../services/slices/appSlice';
import { addItem } from '../../services/slices/itemSlice';
import { useDispatch } from '../../services/store';
import {
  ApiGetTypeSelectors,
  ApiPostImages,
  ApiPostItem,
} from '../../utils/api';
import { apiUrl } from '../../utils/config';
import { IItemDto, ISelect } from '../../utils/types';
import AdminImage from '../AdminImage/AdminImage';
import './AdminItems.scss';

interface IInputData extends Omit<IItemDto, 'images'> {}

// const fileTypes = ['JPG', 'PNG', 'GIF', 'HEIC'];

export default function AdminItems() {
  const { handleError } = useErrorHandler();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, errors },
  } = useForm<IInputData>({
    mode: 'onSubmit',
  });
  const dispatch = useDispatch();
  const [images, setImages] = useState<string[]>([]);

  function handleDeleteImage(image: string) {
    setImages((prev) => prev.filter((item) => item != image));
  }
  const [typeOptions, setTypeOptions] = useState<ISelect[]>([]);
  const [selectedType, setSelectedType] = useState<ISelect | null>(null);
  const [typeInputValue, setTypeInputValue] = useState<string>('');
  const [menuIsOpen, setMenuIsOpen] = useState<boolean>(false);

  function handleEditImage(formData: FormData) {
    ApiPostImages(formData)
      .then((images) =>
        setImages((prev) => {
          const newFile = `${apiUrl}/${images[0].filePath}`;
          return prev.map((item) => (item !== newFile ? newFile : item));
        }),
      )
      .catch(handleError);
  }

  const toggleMenu = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  const onSubmit: SubmitHandler<IInputData> = (data) => {
    ApiPostItem({
      ...data,
      price: Number(data.price),
      images,
      type: selectedType!.value,
    })
      .then((item) => {
        reset();
        setImages([]);
        dispatch(openSnackBar({ text: 'Успешно' }));
        dispatch(addItem(item));
      })
      .catch(handleError);
  };

  const handleDropImages = (files: FileList | File) => {
    const formData = new FormData();

    if (files instanceof FileList) {
      Array.from(files).forEach((file) => formData.append('files', file));
    } else {
      formData.append('files', files);
    }
    ApiPostImages(formData)
      .then((images) =>
        setImages((prev) => [
          ...prev,
          ...images.map((image) => `${apiUrl}/${image.filePath}`),
        ]),
      )
      .catch(handleError);
  };

  useEffect(() => {
    ApiGetTypeSelectors()
      .then((selectors) =>
        setTypeOptions(() =>
          selectors?.map(({ name }) => ({ label: name, value: name })),
        ),
      )
      .catch(handleError);
  }, []);

  const handleTypeInputChange = (input: string) => {
    setTypeInputValue(input);
  };

  const handleCreateOption = () => {
    const newOption = { label: typeInputValue, value: typeInputValue };
    setTypeOptions((prevOptions) => [...prevOptions, newOption]);
    setSelectedType(newOption);
    setTypeInputValue('');
    toggleMenu();
  };

  const CustomMenu = (props: MenuProps<ISelect>) => {
    const { children, selectProps } = props;

    return (
      <components.Menu {...props}>
        {children}
        {selectProps.inputValue &&
          !selectProps.options.some(
            (opt: unknown) => (opt as ISelect).label === selectProps.inputValue,
          ) && (
            <div
              style={{ padding: '10px', cursor: 'pointer', color: 'blue' }}
              onClick={(e) => {
                e.stopPropagation();
                handleCreateOption();
              }}
            >
              Добавить "{selectProps.inputValue}"
            </div>
          )}
      </components.Menu>
    );
  };

  const handleChangeSelect = (
    newValue: SingleValue<ISelect> | MultiValue<ISelect>,
  ) => {
    setSelectedType(newValue as SingleValue<ISelect>);
  };

  return (
    <>
      <Link to={'/admin/items'} className="link admin__section-link">
        Назад
      </Link>
      <section className="admin__section" onSubmit={handleSubmit(onSubmit)}>
        <form className="form">
          <div className="form__container-parrent">
            <div className="form__container">
              <label className="form__label">
                {errors.name && (
                  <p className="form__error">{errors.name.message}</p>
                )}
                <input
                  className="form__input"
                  placeholder="название"
                  {...register('name', {
                    required: true,
                    minLength: 2,
                    max: 128,
                  })}
                />
              </label>
              <label className="form__label">
                {errors.description && (
                  <p className="form__error">{errors.description.message}</p>
                )}
                <textarea
                  className="form__input form__input_textarea"
                  placeholder="описание"
                  {...register('description', { required: true })}
                />
              </label>
              <label>
                {errors.price && (
                  <p className="form__error">{errors.price.message}</p>
                )}
                <input
                  className="form__input"
                  placeholder="цена"
                  type="number"
                  {...register('price', { required: true })}
                />
              </label>
              <label className="form__label">
                Пол
                <select
                  className="form__input"
                  defaultValue={'unisex'}
                  {...register('gender', { required: true })}
                >
                  <option value={'male'}>Мужское</option>
                  <option value={'female'}>Женское</option>
                  <option value={'unisex'}>Унисекс</option>
                </select>
              </label>
              <label className="form__label">
                Активное время
                <select
                  className="form__input"
                  defaultValue={'90d'}
                  {...register('active_time', { required: true })}
                >
                  <option value={'90d'}>90 дней</option>
                  <option value={'180d'}>180 дней</option>
                  <option value={'Infinity'}>Бессрочно</option>
                </select>
              </label>
              <label>
                <Select
                  components={{ Menu: CustomMenu }}
                  options={typeOptions}
                  onChange={handleChangeSelect}
                  onInputChange={handleTypeInputChange}
                  inputValue={typeInputValue}
                  value={selectedType}
                  onMenuClose={() => setMenuIsOpen(false)}
                  menuIsOpen={menuIsOpen}
                  onFocus={() => setMenuIsOpen(true)}
                />
              </label>
              <label className="form__label">
                Активно
                <input
                  className="form__input"
                  type="checkbox"
                  defaultChecked
                  {...register('is_active')}
                />
              </label>
            </div>
            <div className="form__label form__label_images">
              <div className="form__grid-container">
                {images?.map((image, index) => (
                  <AdminImage
                    image={image}
                    key={index}
                    editCb={handleEditImage}
                    deleteCb={handleDeleteImage}
                  />
                ))}
              </div>
              <div className="form__label_absolute">
                <FileUploader
                  handleChange={handleDropImages}
                  // types={fileTypes}
                  multiple
                  hoverTitle="Перетащите фото"
                  children={
                    <>
                      {!images.length && (
                        <p className="form__centralized-text">
                          Перетащите фото (мин количество 2)
                        </p>
                      )}
                    </>
                  }
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="form__button form__button_submit"
            disabled={images.length < 2 || !isValid || !selectedType}
          >
            Сохранить
          </button>
        </form>
      </section>
    </>
  );
}
