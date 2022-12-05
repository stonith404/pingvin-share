import { showNotification } from "@mantine/notifications";
import { TbCheck, TbX } from "react-icons/tb";
const error = (message: string) =>
  showNotification({
    icon: <TbX />,
    color: "red",
    radius: "md",
    title: "Error",

    message: message,
  });

const axiosError = (axiosError: any) =>
  error(axiosError?.response?.data?.message ?? "An unknown error occured");

const success = (message: string) =>
  showNotification({
    icon: <TbCheck />,
    color: "green",
    radius: "md",
    title: "Success",
    message: message,
  });

const toast = {
  error,
  success,
  axiosError,
};
export default toast;
