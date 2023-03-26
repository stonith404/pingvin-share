import { NotificationProps, showNotification } from "@mantine/notifications";
import { TbCheck, TbX } from "react-icons/tb";
const error = (message: string, config?: Omit<NotificationProps, "message">) =>
  showNotification({
    icon: <TbX />,
    color: "red",
    radius: "md",
    title: "Error",
    message: message,

    autoClose: true,

    ...config,
  });

const axiosError = (axiosError: any) =>
  error(axiosError?.response?.data?.message ?? "发生了一个未知错误");

const success = (
  message: string,
  config?: Omit<NotificationProps, "消息">
) =>
  showNotification({
    icon: <TbCheck />,
    color: "green",
    radius: "md",
    title: "成功",
    message: message,
    autoClose: true,
    ...config,
  });

const toast = {
  error,
  success,
  axiosError,
};
export default toast;
