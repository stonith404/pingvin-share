import { ActionIcon, Button, Stack, TextInput, Title } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { TbCopy } from "react-icons/tb";
import toast from "../../../utils/toast.util";

const showCompletedReverseShareModal = (
  modals: ModalsContextProps,
  link: string,
  getReverseShares: () => void
) => {
  return modals.openModal({
    closeOnClickOutside: false,
    withCloseButton: false,
    closeOnEscape: false,
    title: (
      <Stack align="stretch" spacing={0}>
        <Title order={4}>Reverse share link</Title>
      </Stack>
    ),
    children: <Body link={link} getReverseShares={getReverseShares} />,
  });
};

const Body = ({
  link,
  getReverseShares,
}: {
  link: string;
  getReverseShares: () => void;
}) => {
  const clipboard = useClipboard({ timeout: 500 });
  const modals = useModals();

  return (
    <Stack align="stretch">
      <TextInput
        readOnly
        variant="filled"
        value={link}
        rightSection={
          window.isSecureContext && (
            <ActionIcon
              onClick={() => {
                clipboard.copy(link);
                toast.success("Your link was copied to the keyboard.");
              }}
            >
              <TbCopy />
            </ActionIcon>
          )
        }
      />

      <Button
        onClick={() => {
          modals.closeAll();
          getReverseShares();
        }}
      >
        Done
      </Button>
    </Stack>
  );
};

export default showCompletedReverseShareModal;
