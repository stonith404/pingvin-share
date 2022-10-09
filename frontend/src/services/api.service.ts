import axios, { AxiosError } from "axios";
import { getCookie } from "cookies-next";
import toast from "../utils/toast.util";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(
  (config) => {
    const accessToken = getCookie("access_token");
    if (accessToken) {
      config!.headers!.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status == 400) {
      toast.error(error.response?.data?.message ?? "An unkown error occured");
    }

    return Promise.reject(error);
  }
);

export default api;
