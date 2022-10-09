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
import moment from "moment";
import { useRouter } from "next/router";
import { Copy } from "tabler-icons-react";
import { Share } from "../../types/share.type";
import toast from "../../utils/toast.util";

const showCompletedUploadModal = (
  modals: ModalsContextProps,
  share: Share,
) => {
  return modals.openModal({
    closeOnClickOutside: false,
    withCloseButton: false,
    closeOnEscape: false,
    title: (
      <Group grow direction="column" spacing={0}>
        <Title order={4}>Share ready</Title>
      </Group>
    ),
    children: <Body share={share} />,
  });
};

const Body = ({ share }: { share: Share }) => {
  const clipboard = useClipboard({ timeout: 500 });
  const modals = useModals();
  const router = useRouter();
  const link = `${window.location.origin}/share/${share.id}`;
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
        Your share expires at {moment(share.expiration).format("LLL")}
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
