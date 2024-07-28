import { useRouter } from "next/navigation";
import { openAuthPopup } from "../redux/slices/authPopupSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

export default function useProtectedAuthClick() {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector((state) => state.userSlice);
  const router = useRouter();
  function handleClick(action: () => void) {
    if (isLoggedIn) {
      action();
    } else {
      router.push("/");
      dispatch(openAuthPopup());
    }
  }
  return { handleClick };
}
