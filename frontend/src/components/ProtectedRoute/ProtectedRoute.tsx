import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../services/slices/userSlice';
import { useDispatch } from '../../services/store';
import { ApiCheckAuth } from '../../utils/api';

interface IProtectedRoute {
  requiredLevel?: number;
  children: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredLevel = 0,
}: IProtectedRoute) {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    ApiCheckAuth()
      .then((userData) => {
        if (userData.auth_level >= requiredLevel) {
          setIsLoading(false);
          dispatch(login(userData));
        } else {
          return navigate('/');
        }
      })
      .catch(() => {
        navigate('/');
      });
  }, []);

  return <>{isLoading ? <></> : children}</>;
}
