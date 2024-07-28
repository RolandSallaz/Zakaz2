"use client";
import { useEffect, useState } from "react";
import { login } from "../../lib/redux/slices/userSlice";
import { ApiCheckAuth } from "../../lib/utils/api";
import { useAppDispatch } from "@/app/lib/redux/store";
import { useRouter } from "next/navigation";

interface IProtectedRoute {
  requiredLevel?: number;
  children: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredLevel = 0,
}: IProtectedRoute) {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    ApiCheckAuth()
      .then((userData) => {
        if (userData.auth_level >= requiredLevel) {
          setIsLoading(false);
          dispatch(login(userData));
        } else {
          return router.push("/");
        }
      })
      .catch(() => {
        router.push("/");
      });
  }, []);

  return <>{isLoading ? <></> : children}</>;
}
