import { useEffect, useState } from 'react';
import './AdminUsers.scss';
import { IUser } from '../../utils/types';
import { ApiGetAllUsers } from '../../utils/api';
import useErrorHandler from '../../hooks/useErrorHandler';

export default function AdminUsers() {
  const [users, setUsers] = useState<IUser[]>([]);
  const { handleError } = useErrorHandler();
  useEffect(() => {
    ApiGetAllUsers().then(setUsers).catch(handleError);
  }, []);
  return (
    <div>
      {users?.map((user) => (
        <div>
          <p>{user.id}</p>
          <p>{user.email}</p>
          <p>{user.auth_level}</p>
        </div>
      ))}
    </div>
  );
}
