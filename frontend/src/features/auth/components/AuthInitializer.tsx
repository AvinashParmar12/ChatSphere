// ==============================
// Imports
// ==============================

import { type ReactNode, useEffect } from "react";
import { useGetCurrentUserQuery } from "../api/auth.api";
import { setAuthenticated, setUser, setLoading } from "../auth.slice";
import { getToken, removeToken } from "@/utils/token";
import { useAppDispatch } from "@/store/hooks";

// ==============================
// Props
// ==============================

interface AuthInitializerProps {
  children: ReactNode;
}

// ==============================
// Component
// ==============================

const AuthInitializer = ({
  children,
}: AuthInitializerProps) => {
  const dispatch = useAppDispatch();

  const token = getToken();

  const { data, isSuccess, isError } =
    useGetCurrentUserQuery(undefined, {
      skip: !token,
    });

  useEffect(() => {
    if (!token) {
      dispatch(setUser(null));
      dispatch(setAuthenticated(false));
      dispatch(setLoading(false));
      return;
    }

    if (isSuccess && data) {
      // Safely extract user from various possible response structures
      const userPayload = (data as any).data?.user || data.data || (data as any).user || data;
      dispatch(setUser(userPayload));
      dispatch(setAuthenticated(true));
      dispatch(setLoading(false));
    }

    if (isError) {
      removeToken();
      dispatch(setUser(null));
      dispatch(setAuthenticated(false));
      dispatch(setLoading(false));
    }
  }, [dispatch, token, isSuccess, isError, data]);

  return <>{children}</>;
};

export default AuthInitializer;