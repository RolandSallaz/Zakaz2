import { Suspense } from "react";
import FindPage from "../components/FindPage/FindPage";

export default function Page() {
  return (
    <Suspense>
      <FindPage />
    </Suspense>
  );
}
