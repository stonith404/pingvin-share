import { Button } from "@mantine/core";
import useUser from "../../../hooks/user.hook";
import configService from "../../../services/config.service";
import toast from "../../../utils/toast.util";

const TestEmailButton = () => {

    const {user} = useUser();

  return (
    <Button
      variant="light"
      onClick={() =>
        configService
          .sendTestEmail(user!.email)
          .then(() => toast.success("Email sent successfully"))
          .catch(() =>
            toast.error(
              "Failed to send the email. Please check the backend logs for more information."
            )
          )
      }
    >
      Send test email
    </Button>
  );
};
export default TestEmailButton;
