import { Stack, TextInput } from "@mantine/core";
import { ModalsContextProps } from "@mantine/modals/lib/context";

const showReverseShareLinkModal = (
  modals: ModalsContextProps,
  reverseShareToken: string,
  appUrl: string
) => {
  const link = `${appUrl}/upload/${reverseShareToken}`;
  return modals.openModal({
    title: "Reverse share link",
    children: (
      <Stack align="stretch">
        <TextInput variant="filled" value={link} />
      </Stack>
    ),
  });
};

export default showReverseShareLinkModal;
