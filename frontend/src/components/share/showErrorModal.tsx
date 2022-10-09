import { Button, Group, Text, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { useRouter } from "next/router";

const showErrorModal = (
  modals: ModalsContextProps,
  title: string,
  text: string
) => {
  return modals.openModal({
    closeOnClickOutside: false,
    withCloseButton: false,
    closeOnEscape: false,
    title: <Title order={4}>{title}</Title>,

    children: <Body text={text} />,
  });
};

const Body = ({ text }: { text: string }) => {
  const modals = useModals();
  const router = useRouter();
  return (
    <>
      <Group grow direction="column">
        <Text size="sm">{text}</Text>
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

export default showErrorModal;
