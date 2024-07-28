"use client";
import React, { useEffect, useState } from "react";
import Cards from "../components/Cards/Cards";
import { useAppSelector } from "../lib/redux/store";
import { IItem } from "../lib/utils/types";
import styles from "./page.module.scss";
export default function Page() {
  const { likes } = useAppSelector((state) => state.appSlice);
  const { data: items } = useAppSelector((state) => state.itemSlice);
  const [likedItems, setLikedItems] = useState<IItem[]>([]);

  useEffect(() => {
    const filteredItems: IItem[] = items.filter((item) =>
      likes.some((like) => like.id === item.id)
    );
    setLikedItems(filteredItems);
  }, [likes, items]);
  return (
    <main className={`main ${styles.LikesPage}`}>
      {likedItems.length == 0 ? (
        <h2 className={styles.main__heading}>
          Понравившиеся вещи будут добавлены сюда.
        </h2>
      ) : (
        <Cards items={likedItems} />
      )}
    </main>
  );
}
