import { Button, Group, Text, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { useRouter } from "next/router";

const showShareNotFoundModal = (modals: ModalsContextProps) => {
  return modals.openModal({
    closeOnClickOutside: false,
    withCloseButton: false,
    closeOnEscape: false,
    title: <Title order={4}>Not found</Title>,

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
          This share can't be found. Please check your link.
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

export default showShareNotFoundModal;
