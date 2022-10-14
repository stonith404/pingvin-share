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
};
export default toast;
