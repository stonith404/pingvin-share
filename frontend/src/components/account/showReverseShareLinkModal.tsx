import { Stack, TextInput } from "@mantine/core";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { translateOutsideContext } from "../../hooks/useTranslate.hook";

const showReverseShareLinkModal = (
  modals: ModalsContextProps,
  reverseShareToken: string,
  appUrl: string
) => {
  const t = translateOutsideContext();
  const link = `${appUrl}/upload/${reverseShareToken}`;
  return modals.openModal({
    title: t("account.reverseShares.modal.reverse-share-link"),
    children: (
      <Stack align="stretch">
        <TextInput variant="filled" value={link} />
      </Stack>
    ),
  });
};

export default showReverseShareLinkModal;
