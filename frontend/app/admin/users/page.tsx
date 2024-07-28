"use client";
import AdminUpdateRole from "@/app/components/AdminUpdateRole/AdminUpdateRole";
import useErrorHandler from "@/app/lib/hooks/useErrorHandler";
import { openSnackBar } from "@/app/lib/redux/slices/appSlice";
import { useAppDispatch } from "@/app/lib/redux/store";
import { ApiGetAllUsers, ApiUpdateUser } from "@/app/lib/utils/api";
import { IUser } from "@/app/lib/utils/types";
import React, { ChangeEvent, useEffect, useState } from "react";
import styles from "../page.module.scss";
export default function Page() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const { handleError } = useErrorHandler();
  const dispatch = useAppDispatch();

  useEffect(() => {
    ApiGetAllUsers()
      .then((users) => {
        setUsers(users);
        setFilteredUsers(users);
      })
      .catch(handleError);
  }, []);

  function handleUserInputChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.trim(); // Убираем пробелы по краям

    if (value === "") {
      // Если поле ввода пустое, показываем всех пользователей
      setFilteredUsers(users);
    } else {
      // Иначе фильтруем пользователей по введенному значению
      const filteredData = users.filter(
        (user) =>
          user.email.startsWith(value) ||
          user.id.toString() === value ||
          user.auth_level.toString() === value
      );
      setFilteredUsers(filteredData);
    }
  }

  function handleUpdateUserRole(id: number, user: IUser, newRole: number) {
    ApiUpdateUser(id, { ...user, auth_level: newRole })
      .then(() =>
        dispatch(
          openSnackBar({
            text: `Роль ${user.email} изменена с ${user.auth_level} на ${newRole}`,
          })
        )
      )
      .catch(handleError);
  }

  return (
    <section className={styles.admin__section}>
      <input
        className={styles.admin__input}
        placeholder="Поиск пользователя"
        onChange={handleUserInputChange}
      />
      <table className="select">
        <thead>
          <tr>
            <th>Id</th>
            <th>Email</th>
            <th>Созданных товаров</th>
            <th>Права</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers
            .sort((a, b) => b.auth_level - a.auth_level)
            .map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.createdItems.length}</td>
                <td>
                  <AdminUpdateRole
                    key={user.id}
                    user={user}
                    onSave={handleUpdateUserRole}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
}
