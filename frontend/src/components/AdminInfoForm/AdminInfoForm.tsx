import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiGetInfo, ApiUpdateInfo } from '../../utils/api';
import { IInfoType, TInfoType } from '../../utils/types';
import useErrorHandler from '../../hooks/useErrorHandler';
import { useDispatch } from '../../services/store';
import { openSnackBar } from '../../services/slices/appSlice';
import './AdminInfoForm.scss';
interface props {
  infoType: TInfoType;
}

export default function AdminInfoForm({ infoType }: props) {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [info, setInfo] = useState<IInfoType>({ value: '', key: infoType });
  const dispatch = useDispatch();
  useEffect(() => {
    ApiGetInfo(infoType).then(setInfo).catch(handleError);
  }, [navigate]);

  function handleChangeInput(e: ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value;
    if (info) {
      setInfo((prev) => ({ ...prev, value }));
    }
  }

  function handleSubmit() {
    ApiUpdateInfo(info.key, info.value)
      .then(() => {
        dispatch(openSnackBar({ text: 'Успешно' }));
      })
      .catch(handleError);
  }

  return (
    <div className="AdminInfoForm">
      <button onClick={handleSubmit}>Сохранить</button>
      <textarea
        className="AdminInfoForm__input"
        value={info?.value || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
}
