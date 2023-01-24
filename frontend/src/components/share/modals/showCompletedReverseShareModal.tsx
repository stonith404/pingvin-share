import { ActionIcon, Button, Stack, TextInput, Title } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { useRouter } from "next/router";
import { TbCopy } from "react-icons/tb";
import toast from "../../../utils/toast.util";

const showCompletedReverseShareModal = (
  modals: ModalsContextProps,
  link: string
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
    children: <Body link={link} />,
  });
};

const Body = ({ link }: { link: string }) => {
  const clipboard = useClipboard({ timeout: 500 });
  const modals = useModals();
  const router = useRouter();

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
          router.push("/upload");
        }}
      >
        Done
      </Button>
    </Stack>
  );
};

export default showCompletedReverseShareModal;
