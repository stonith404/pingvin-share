import { Button, Stack, Text, Textarea } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import useUser from "../../../hooks/user.hook";
import configService from "../../../services/config.service";
import toast from "../../../utils/toast.util";

const TestEmailButton = ({
  configVariablesChanged,
  saveConfigVariables,
}: {
  configVariablesChanged: boolean;
  saveConfigVariables: () => Promise<void>;
}) => {
  const { user } = useUser();
  const modals = useModals();

  const [isLoading, setIsLoading] = useState(false);

  const sendTestEmail = async () => {
    await configService
      .sendTestEmail(user!.email)
      .then(() => toast.success("Email sent successfully"))
      .catch((e) =>
        modals.openModal({
          title: "Failed to send email",
          children: (
            <Stack spacing="xs">
              <Text size="sm">
                While sending the test email, the following error occurred:
              </Text>
              <Textarea minRows={4} readOnly value={e.response.data.message} />
            </Stack>
          ),
        }),
      );
  };

  return (
    <Button
      loading={isLoading}
      variant="light"
      onClick={async () => {
        if (!configVariablesChanged) {
          setIsLoading(true);
          await sendTestEmail();
          setIsLoading(false);
        } else {
          modals.openConfirmModal({
            title: "Save configuration",
            children: (
              <Text size="sm">
                To continue you need to save the configuration first. Do you
                want to save the configuration and send the test email?
              </Text>
            ),
            labels: { confirm: "Save and send", cancel: "Cancel" },
            onConfirm: async () => {
              setIsLoading(true);
              await saveConfigVariables();
              await sendTestEmail();
              setIsLoading(false);
            },
          });
        }
      }}
    >
      <FormattedMessage id="admin.config.smtp.button.test" />
    </Button>
  );
};
export default TestEmailButton;
