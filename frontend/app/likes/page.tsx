"use client";
import React, { useEffect, useState } from "react";
import Cards from "../components/Cards/Cards";
import { useAppSelector } from "../lib/redux/store";
import { IItem } from "../lib/utils/types";
import styles from "./page.module.scss";
import useErrorHandler from "../lib/hooks/useErrorHandler";
import { ApiGetActualItemsInfo } from "../lib/utils/api";
export default function Page() {
  const { likes } = useAppSelector((state) => state.appSlice);
  const [likedItems, setLikedItems] = useState<IItem[]>([]);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const itemsArray = likes.map(item => item.id)
    if (itemsArray.length > 0) {
      ApiGetActualItemsInfo(`[${String(itemsArray)}]`).then(setLikedItems).catch(handleError)
    }

  }, [likes]);

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
