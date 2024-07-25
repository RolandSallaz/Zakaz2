import { ChangeEvent, useEffect, useState } from 'react';
import useErrorHandler from '../../hooks/useErrorHandler';
import { openSnackBar, setMainHeading } from '../../services/slices/appSlice';
import { useDispatch, useSelector } from '../../services/store';
import { ApiUpdateInfo } from '../../utils/api';
import './AdminInfoPage.scss';
export default function AdminInfoPage() {
  const { main_heading } = useSelector((state) => state.appSlice);
  const dispatch = useDispatch();
  const [mainHeading, setHeading] = useState<string>('');
  const { handleError } = useErrorHandler();

  useEffect(() => {
    setHeading(main_heading);
  }, []);

  function handleMainHeadingChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setHeading(value);
  }

  function handleUpdateHeading() {
    ApiUpdateInfo('heading_info', mainHeading)
      .then((info) => {
        dispatch(setMainHeading(info.value));
        dispatch(openSnackBar({ text: 'Заголовок обновлен' }));
      })
      .catch(handleError);
  }

  return (
    <main className="main AdminInfoPage">
      <label className="AdminInfoPage__info AdminInfoPage__info_main-heading">
        Заголовок на странице
        <div className="AdminInfoPage__container">
          <input
            className="AdminInfoPage__input"
            value={mainHeading}
            onChange={handleMainHeadingChange}
          />
          <button
            className="AdminInfoPage__button"
            onClick={handleUpdateHeading}
          >
            Сохранить
          </button>
        </div>
      </label>
    </main>
  );
}
