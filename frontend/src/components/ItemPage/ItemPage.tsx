import { useNavigate, useParams } from 'react-router-dom';
import './ItemPage.scss';
import { IItem } from '../../utils/types';
import { useEffect, useState } from 'react';
import { useSelector } from '../../services/store';
import { Hearts } from 'react-loader-spinner';
export default function ItemPage() {
  const { id } = useParams();
  const { data: allItems } = useSelector((state) => state.itemSlice);
  const [item, setItem] = useState<IItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const navigate = useNavigate();
  useEffect(() => {
    const foundedItem = allItems.find((item) => item.id == Number(id));
    if (foundedItem) {
      setItem(foundedItem);
      setLoading(false);
    }
  }, [navigate, allItems]);

  useEffect(() => {
    if (item) {
      setActiveImage(item.main_image);
    }
  }, [item]);

  return (
    <main className="main ItemPage">
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
        <>
          <div className="ItemPage__container ItemPage__container_left">
            <h1>{item?.name}</h1>
            <button>Добавить в избранное</button>
            <div>
              {/* todo */}
              <img src={activeImage} />
            </div>
            <div className="ItemPage__grid-container ItemPage__grid-container_images">
              {item?.images.map((image) => (
                <img
                  className="ItemPage__image"
                  id={image}
                  src={image}
                  alt={`Изображение ${item.name}`}
                />
              ))}
            </div>
            <p>{item?.description}</p>
          </div>
          <div className="ItemPage__container ItemPage__container_right">
            <p>{item?.price}</p>
            <button>Купить</button>
            <button>Добавить в корзину</button>
          </div>
        </>
      )}
    </main>
  );
}
