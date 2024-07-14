import { useEffect, useState } from 'react';
import { useSelector } from '../../services/store';
import { IItem } from '../../utils/types';
import './LikesPage.scss';
import Cards from '../Cards/Cards';

export default function LikesPage() {
  const { likes } = useSelector((state) => state.appSlice);
  const { data: items } = useSelector((state) => state.itemSlice);
  const [likedItems, setLikedItems] = useState<IItem[]>([]);

  useEffect(() => {
    const filteredItems: IItem[] = items.filter((item) =>
      likes.some((like) => like.id === item.id),
    );
    setLikedItems(filteredItems);
  }, [likes, items]);

  return (
    <main className="main LikesPage">
      {likedItems.length == 0 ? (
        <h2 className="main__heading">
          Понравившиеся вещи будут добавлены сюда.
        </h2>
      ) : (
        <Cards items={likedItems} />
      )}
    </main>
  );
}
