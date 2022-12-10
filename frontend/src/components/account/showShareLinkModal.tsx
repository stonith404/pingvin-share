import { Stack, TextInput } from "@mantine/core";
import { ModalsContextProps } from "@mantine/modals/lib/context";

const showShareLinkModal = (modals: ModalsContextProps, shareId: string) => {
  const link = `${window.location.origin}/share/${shareId}`;
  return modals.openModal({
    title: "Share link",
    children: (
      <Stack align="stretch">
        <TextInput variant="filled" value={link} />
      </Stack>
    ),
  });
};

export default showShareLinkModal;
