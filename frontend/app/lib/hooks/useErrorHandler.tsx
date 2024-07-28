import { useCallback } from "react";
import { openSnackBar } from "../redux/slices/appSlice";
import { IRequestError } from "../utils/types";
import { useAppDispatch } from "../redux/store";

export default function useErrorHandler() {
  const dispatch = useAppDispatch();

  const handleError = useCallback(
    ({ message, statusCode = 500 }: IRequestError) => {
      dispatch(
        openSnackBar({
          text: `${statusCode} ${message}`,
          hasError: true,
        })
      );
    },
    [dispatch]
  );

  return { handleError };
}
