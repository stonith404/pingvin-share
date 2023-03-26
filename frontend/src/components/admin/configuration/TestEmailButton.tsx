import { Button, Stack, Text, Textarea } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useState } from "react";
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
      .then(() => toast.success("电子邮件发送成功"))
      .catch((e) =>
        modals.openModal({
          title: "发送电子邮件失败",
          children: (
            <Stack spacing="xs">
              <Text size="sm">
              发送测试电子邮件时，出现以下错误：
              </Text>
              <Textarea minRows={4} readOnly value={e.response.data.message} />
            </Stack>
          ),
        })
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
                要继续，您需要先保存配置。你想要保存配置并发送测试电子邮件吗？
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
      发送测试电子邮件
    </Button>
  );
};
export default TestEmailButton;
