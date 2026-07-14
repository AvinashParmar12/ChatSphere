import { useDispatch } from "react-redux";

import { useLoginMutation } from "../api/auth.api";
import { setAuthenticated } from "../auth.slice";

import { saveToken } from "@/utils/token";

import type { LoginFormData } from "../validation/login.schema";

export const useLogin = () => {
  const dispatch = useDispatch();

  const [loginMutation, { isLoading }] =
    useLoginMutation();

  const login = async (
    data: LoginFormData
  ): Promise<boolean> => {
    try {
      const response =
        await loginMutation(data).unwrap();

      saveToken(response.data.accessToken);

      dispatch(setAuthenticated(true));

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  };

  return {
    login,
    isLoading,
  };
};