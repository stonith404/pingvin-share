import { showNotification } from "@mantine/notifications";
import { Check, X } from "tabler-icons-react";

const error = (message: string) =>
  showNotification({
    icon: <X />,
    color: "red",
    radius: "md",
    title: "Error",
    
    message: message,
  });

const success = (message: string) =>
  showNotification({
    icon: <Check />,
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
