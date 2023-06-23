import { Button, Stack } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import CopyTextField from "../../upload/CopyTextField";

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
  const modals = useModals();

  return (
    <Stack align="stretch">
      <CopyTextField link={link} />

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
