"use client";
import useErrorHandler from "@/app/lib/hooks/useErrorHandler";
import { setMainHeading, openSnackBar } from "@/app/lib/redux/slices/appSlice";
import { useAppSelector, useAppDispatch } from "@/app/lib/redux/store";
import { ApiUpdateInfo } from "@/app/lib/utils/api";
import React, { ChangeEvent, useEffect, useState } from "react";
import styles from "./page.module.scss";
export default function Page() {
  const { main_heading } = useAppSelector((state) => state.appSlice);
  const dispatch = useAppDispatch();
  const [mainHeading, setHeading] = useState<string>("");
  const { handleError } = useErrorHandler();

  useEffect(() => {
    setHeading(main_heading);
  }, []);

  function handleMainHeadingChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setHeading(value);
  }

  function handleUpdateHeading() {
    ApiUpdateInfo("heading_info", mainHeading)
      .then((info) => {
        dispatch(setMainHeading(info.value));
        dispatch(openSnackBar({ text: "Заголовок обновлен" }));
      })
      .catch(handleError);
  }
  return (
    <main className={`main ${styles.AdminInfoPage}`}>
      <label
        className={`${styles.AdminInfoPage__info} ${styles.AdminInfoPage__info_mainHeading}`}
      >
        Заголовок на странице
        <div className={styles.AdminInfoPage__container}>
          <input
            className={styles.AdminInfoPage__input}
            value={mainHeading}
            onChange={handleMainHeadingChange}
          />
          <button
            className={styles.AdminInfoPage__button}
            onClick={handleUpdateHeading}
          >
            Сохранить
          </button>
        </div>
      </label>
    </main>
  );
}
