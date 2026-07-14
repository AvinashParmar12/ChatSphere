import type { AxiosError, AxiosRequestConfig } from "axios";
import { axiosInstance } from "./axios";

type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: unknown;
  params?: unknown;
};

export const axiosBaseQuery =
  () =>
  async ({
    url,
    method,
    data,
    params,
  }: AxiosBaseQueryArgs) => {
    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
      });

      return {
        data: result.data,
      };
    } catch (error) {
      const err = error as AxiosError;

      return {
        error: {
          status: err.response?.status,
          data: err.response?.data,
        },
      };
    }
  };