import { Link } from 'react-router-dom';
import './InfoPage.scss';
import { TInfoType } from '../../utils/types';
import { useEffect, useState } from 'react';
import { ApiGetInfo } from '../../utils/api';
import { Hearts } from 'react-loader-spinner';
import './InfoPage.scss';
interface props {
  infoType: TInfoType;
}

export default function InfoPage({ infoType }: props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    ApiGetInfo(infoType)
      .then((res) => setValue(res.value))
      .catch(() => setValue('Ошибка загрузки. Попробуйте позднее'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="main InfoPage">
      <Link className="InfoPage__link" to="/">
        На главную
      </Link>
      {loading ? (
        <Hearts
          height="160"
          width="160"
          color="#f03535"
          ariaLabel="Загрука"
          wrapperClass="ItemPage__loading"
          visible={true}
        />
      ) : (
        <p className="InfoPage__text">{value}</p>
      )}
    </main>
  );
}
