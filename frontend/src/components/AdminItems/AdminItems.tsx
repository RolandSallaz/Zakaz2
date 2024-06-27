import { ChangeEvent, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import useErrorHandler from '../../hooks/useErrorHandler';
import { addItem } from '../../services/slices/itemSlice';
import { useDispatch } from '../../services/store';
import { ApiPostImage, ApiPostItem } from '../../utils/api';
import { apiUrl } from '../../utils/config';
import { IItemDto } from '../../utils/types';
import { ejectFile } from '../../utils/utils';
import AdminImage from '../AdminImage/AdminImage';
import './AdminItems.scss';

interface IInputData extends Omit<IItemDto, 'main_image' | 'images'> {}

export default function AdminItems() {
  const { handleError } = useErrorHandler();
  const { register, handleSubmit } = useForm<IInputData>({
    mode: 'onSubmit',
  });
  const dispatch = useDispatch();
  const [images, setImages] = useState<string[]>([]);
  const [mainImage, setMainImage] = useState<string>('');

  function handleUploadImage(formData: FormData, cb: (image: string) => void) {
    ApiPostImage(formData)
      .then((file) => {
        const correctedPath = file.path.replace(/\\/g, '/');
        const image = `${apiUrl}/${correctedPath}`;
        return cb(image);
      })
      .catch(handleError);
  }
  function handleEditMainImage(e: ChangeEvent<HTMLInputElement>) {
    handleUploadImage(ejectFile(e), setMainImage);
  }

  function handleAddNewImage(e: ChangeEvent<HTMLInputElement>) {
    handleUploadImage(ejectFile(e), (image) =>
      setImages((prev) => [...prev, image]),
    );
  }

  function handleDeleteImage(image: string) {
    setImages((prev) => prev.filter((item) => item != image));
  }

  function handleEditImage(formData: FormData) {
    handleUploadImage(formData, (image) => {
      setImages((prev) => prev.map((item) => (item == image ? item : image)));
    });
  }

  const onSubmit: SubmitHandler<IInputData> = (data) => {
    ApiPostItem({
      ...data,
      price: Number(data.price),
      images,
      main_image: mainImage,
    })
      .then((item) => {
        dispatch(addItem(item));
      })
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
              className="form__label form__label_image form__label_image_main"
              style={{ backgroundImage: `url(${mainImage})` }}
            >
              {!mainImage && 'Главное изобаржение'}
              <input
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleEditMainImage}
              />
            </label>
            <div className="form__grid-container">
              {images?.map((image, index) => (
                <AdminImage
                  image={image}
                  key={index}
                  editCb={handleEditImage}
                  deleteCb={handleDeleteImage}
                />
              ))}
              {images.length < 10 && (
                <label className="form__label form__label_image">
                  +
                  <input
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={handleAddNewImage}
                  />
                </label>
              )}
            </div>
          </div>
          <button type="submit">Сохранить</button>
        </form>
      </section>
    </>
  );
}
