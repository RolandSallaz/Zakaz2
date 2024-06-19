import { ChangeEvent, useEffect, useState } from 'react';
import useErrorHandler from '../../hooks/useErrorHandler';
import { openSnackBar } from '../../services/slices/appSlice';
import { useDispatch } from '../../services/store';
import { ApiGetAllUsers, ApiUpdateUser } from '../../utils/api';
import { IUser } from '../../utils/types';
import AdminUpdateRole from '../AdminUpdateRole/AdminUpdateRole';
import './AdminUsers.scss';

export default function AdminUsers() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const { handleError } = useErrorHandler();
  const dispatch = useDispatch();

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

    if (value === '') {
      // Если поле ввода пустое, показываем всех пользователей
      setFilteredUsers(users);
    } else {
      // Иначе фильтруем пользователей по введенному значению
      const filteredData = users.filter(
        (user) =>
          user.email.startsWith(value) ||
          user.id.toString() === value ||
          user.auth_level.toString() === value,
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
          }),
        ),
      )
      .catch(handleError);
  }

  return (
    <section className="admin__section">
      <input
        className="admin__input"
        placeholder="Поиск пользователя"
        onChange={handleUserInputChange}
      />
      <table className="select">
        <thead>
          <tr>
            <th>Id</th>
            <th>Email</th>
            <th>Права</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
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
