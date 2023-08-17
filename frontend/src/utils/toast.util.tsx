import { NotificationProps, showNotification } from "@mantine/notifications";
import { TbCheck, TbX } from "react-icons/tb";
import { FormattedMessage } from "react-intl";

const error = (message: string, config?: Omit<NotificationProps, "message">) =>
  showNotification({
    icon: <TbX />,
    color: "red",
    radius: "md",
    title: <FormattedMessage id="common.error" />,
    message: message,

    autoClose: true,

    ...config,
  });

const axiosError = (axiosError: any) =>
  error(axiosError?.response?.data?.message ?? "An unknown error occurred");

const success = (
  message: string,
  config?: Omit<NotificationProps, "message">,
) =>
  showNotification({
    icon: <TbCheck />,
    color: "green",
    radius: "md",
    title: <FormattedMessage id="common.success" />,
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
