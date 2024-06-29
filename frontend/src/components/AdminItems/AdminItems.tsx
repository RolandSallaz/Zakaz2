import { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import useErrorHandler from '../../hooks/useErrorHandler';
import { openSnackBar } from '../../services/slices/appSlice';
import { addItem } from '../../services/slices/itemSlice';
import { useDispatch } from '../../services/store';
import { ApiPostImages, ApiPostItem } from '../../utils/api';
import { apiUrl } from '../../utils/config';
import { IItemDto } from '../../utils/types';
import AdminImage from '../AdminImage/AdminImage';
import './AdminItems.scss';

interface IInputData extends Omit<IItemDto, 'main_image' | 'images'> {}

const fileTypes = ['JPG', 'PNG', 'GIF'];

export default function AdminItems() {
  const { handleError } = useErrorHandler();
  const { register, handleSubmit } = useForm<IInputData>({
    mode: 'onSubmit',
  });
  const dispatch = useDispatch();
  const [images, setImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>('');

  function handleUploadImage(formData: FormData, cb: (image: string) => void) {
    ApiPostImages(formData)
      .then((files) => {
        const image = `${apiUrl}/${files[0].filePath}`;
        return cb(image);
      })
      .catch(handleError);
  }
  function handleEditMainImage(file: File) {
    const formData = new FormData();
    formData.append('files', file);
    handleUploadImage(formData, setMainImage);
  }

  function handleDeleteImage(image: string) {
    setImages((prev) => prev.filter((item) => item != image));
  }

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

  const onSubmit: SubmitHandler<IInputData> = (data) => {
    ApiPostItem({
      ...data,
      price: Number(data.price),
      images,
      main_image: mainImage,
    })
      .then((item) => {
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

  return (
    <>
      <Link to={'/admin/items'} className="link admin__section-link">
        Назад
      </Link>
      <section className="admin__section" onSubmit={handleSubmit(onSubmit)}>
        <form className="form">
          <div className="form__container-parrent">
            <div className="form__container">
              <input
                className="form__input"
                placeholder="название"
                {...register('name', {
                  required: true,
                  minLength: 2,
                  max: 128,
                })}
              />
              <textarea
                className="form__textarea"
                placeholder="описание"
                {...register('description', { required: true })}
              />
              <input
                className="form__input"
                placeholder="цена"
                type="number"
                {...register('price', { required: true })}
              />
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
                  defaultValue={'15d'}
                  {...register('active_time', { required: true })}
                >
                  <option value={'15d'}>15 дней</option>
                  <option value={'30d'}>30 дней</option>
                  <option value={'90d'}>90 дней</option>
                </select>
              </label>
              <input
                className="form__input"
                placeholder="тип"
                {...register('type', { required: true })}
              />
              <label className="form__label">
                Активно
                <input
                  className="form__input"
                  type="checkbox"
                  defaultChecked
                  {...register('is_active', { required: true })}
                />
              </label>
            </div>
            <label
              className="form__label form__label_image_main"
              style={{ backgroundImage: `url(${mainImage})` }}
            >
              <FileUploader
                handleChange={handleEditMainImage}
                types={fileTypes}
                hoverTitle="Перетащите основное фото"
                children={
                  <>
                    {mainImage && (
                      <img className="form__image" src={mainImage} />
                    )}
                  </>
                }
              />
            </label>
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
                  types={fileTypes}
                  multiple
                  hoverTitle="Перетащите фото"
                  children={<></>}
                />
              </div>
            </div>
          </div>
          <button type="submit">Сохранить</button>
        </form>
      </section>
    </>
  );
}
