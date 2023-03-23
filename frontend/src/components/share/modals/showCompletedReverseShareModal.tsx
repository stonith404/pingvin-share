import { ActionIcon, Button, Stack, TextInput } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { TbCopy } from "react-icons/tb";
import { FormattedMessage, useIntl } from "react-intl";
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
    title: "Reverse share link",
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
  const intl = useIntl();

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
                toast.success(intl.formatMessage({id:"common.notify.copied"}));
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
        <FormattedMessage id="common.button.done" />
      </Button>
    </Stack>
  );
};

export default showCompletedReverseShareModal;
