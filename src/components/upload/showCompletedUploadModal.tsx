import {
  ActionIcon,
  Button,
  Group,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { useRouter } from "next/router";
import { Copy } from "tabler-icons-react";
import toast from "../../utils/toast.util";

const showCompletedUploadModal = (
  modals: ModalsContextProps,
  link: string,
  expiresAt: string
) => {
  return modals.openModal({
    closeOnClickOutside: false,
    withCloseButton: false,
    closeOnEscape: false,
    title: <Title order={4}>Share ready</Title>,
    children: <Body link={link} expiresAt={expiresAt} />,
  });
};

const Body = ({ link, expiresAt }: { link: string; expiresAt: string }) => {
  const clipboard = useClipboard({ timeout: 500 });
  const modals = useModals();
  const router = useRouter();
  return (
    <Group grow direction="column">
      <TextInput
        variant="filled"
        value={link}
        rightSection={
          <ActionIcon
            onClick={() => {
              clipboard.copy(link);
              toast.success("Your link was copied to the keyboard.");
            }}
          >
            <Copy />
          </ActionIcon>
        }
      />
      <Text
        size="xs"
        sx={(theme) => ({
          color: theme.colors.gray[6],
        })}
      >
        Your share expires at {expiresAt}{" "}
      </Text>

      <Button
        onClick={() => {
          modals.closeAll();
          router.push("/upload");
        }}
      >
        Done
      </Button>
    </Group>
  );
};

export default showCompletedUploadModal;
