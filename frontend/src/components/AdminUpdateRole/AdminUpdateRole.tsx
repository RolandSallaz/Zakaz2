import { useState } from 'react';
import { IUser, ROLES } from '../../utils/types';

interface props {
  user: IUser;
  onSave: (id: number, user: IUser, auth_level: number) => void;
}

export default function AdminUpdateRole({ user, onSave }: props) {
  const [selectedRole, setSelectedRole] = useState<number>(user.auth_level);

  return (
    <>
      <select
        defaultValue={user.auth_level}
        onChange={(e) => {
          const value = Number(e.target.value);
          setSelectedRole(value);
        }}
      >
        {Object.keys(ROLES).map((item) => {
          const value = ROLES[Number(item)];
          if (!isNaN(Number(item))) {
            return (
              <option key={item} value={item}>{`${value} - ${item}`}</option>
            );
          }
          return null;
        })}
      </select>
      <button
        className="admin__submit-button"
        onClick={() => onSave(user.id, user, selectedRole)}
      >
        Сохранить
      </button>
    </>
  );
}
