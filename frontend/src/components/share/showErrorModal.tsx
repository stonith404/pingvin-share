import { Button, Stack, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { useRouter } from "next/router";
import { FormattedMessage } from "react-intl";

const showErrorModal = (
  modals: ModalsContextProps,
  title: string,
  text: string
) => {
  return modals.openModal({
    closeOnClickOutside: false,
    withCloseButton: false,
    closeOnEscape: false,
    title: title,

    children: <Body text={text} />,
  });
};

const Body = ({ text }: { text: string }) => {
  const modals = useModals();
  const router = useRouter();
  return (
    <>
      <Stack align="stretch">
        <Text size="sm">{text}</Text>
        <Button
          onClick={() => {
            modals.closeAll();
            router.back();
          }}
        >
          <FormattedMessage id="common.button.go-back" />
        </Button>
      </Stack>
    </>
  );
};

export default showErrorModal;
