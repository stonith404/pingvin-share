import { Button, Stack, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";

const showErrorModal = (
  modals: ModalsContextProps,
  title: string,
  text: string,
  action: "go-back" | "go-home" = "go-back",
) => {
  return modals.openModal({
    closeOnClickOutside: false,
    withCloseButton: false,
    closeOnEscape: false,
    title: title,

    children: <Body text={text} action={action} />,
  });
};

const Body = ({
  text,
  action,
}: {
  text: string;
  action: "go-back" | "go-home";
}) => {
  const modals = useModals();
  const router = useRouter();
  return (
    <>
      <Stack align="stretch">
        <Text size="sm">{text}</Text>
        <Button
          onClick={() => {
            modals.closeAll();
            if (action === "go-back") {
              router.back();
            } else if (action === "go-home") {
              router.push("/");
            }
          }}
        >
          <FormattedMessage id={`common.button.${action}`} />
        </Button>
      </Stack>
    </>
  );
};

export default showErrorModal;
