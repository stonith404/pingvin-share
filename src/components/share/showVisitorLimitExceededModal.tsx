import { Button, Group, Text, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { useRouter } from "next/router";

const showVisitorLimitExceededModal = (modals: ModalsContextProps) => {
  return modals.openModal({
    closeOnClickOutside: false,
    withCloseButton: false,
    closeOnEscape: false,
    title: <Title order={4}>Visitor limit exceeded</Title>,

    children: <Body />,
  });
};

const Body = () => {
  const modals = useModals();
  const router = useRouter();
  return (
    <>
      <Group grow direction="column">
        <Text size="sm">
          The visitor count limit from this share has been exceeded.
        </Text>
        <Button
          onClick={() => {
            modals.closeAll();
            router.back();
          }}
        >
          Go back
        </Button>
      </Group>
    </>
  );
};

export default showVisitorLimitExceededModal;
