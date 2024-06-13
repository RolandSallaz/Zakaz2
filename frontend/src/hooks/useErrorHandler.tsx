import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { openSnackBar } from '../services/slices/appSlice';
import { IRequestError } from '../utils/types';

export default function useErrorHandler() {
  const dispatch = useDispatch();

  const handleError = useCallback(
    ({ message, statusCode = 500 }: IRequestError) => {
      dispatch(
        openSnackBar({
          text: `${statusCode} ${message}`,
          hasError: true,
        }),
      );
    },
    [dispatch],
  );

  return { handleError };
}
