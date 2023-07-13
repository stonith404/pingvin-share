import { Button, Stack, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import moment from "moment";
import { useRouter } from "next/router";
import { Share } from "../../../types/share.type";
import CopyTextField from "../CopyTextField";

const showCompletedUploadModal = (
  modals: ModalsContextProps,
  share: Share,
  appUrl: string
) => {
  return modals.openModal({
    closeOnClickOutside: false,
    withCloseButton: false,
    closeOnEscape: false,
    title: "Share ready",
    children: <Body share={share} appUrl={appUrl} />,
  });
};

const Body = ({ share, appUrl }: { share: Share; appUrl: string }) => {
  const modals = useModals();
  const router = useRouter();

  const link = `${appUrl}/share/${share.id}`;

  return (
    <Stack align="stretch">
      <CopyTextField link={link} />
      <Text
        size="xs"
        sx={(theme) => ({
          color: theme.colors.gray[6],
        })}
      >
        {/* If our share.expiration is timestamp 0, show a different message */}
        {moment(share.expiration).unix() === 0
          ? "This share will never expire."
          : `This share will expire on ${moment(share.expiration).format(
              "LLL"
            )}`}
      </Text>

      <Button
        onClick={() => {
          modals.closeAll();
          router.push("/upload");
        }}
      >
        <FormattedMessage id="common.button.done" />
      </Button>
    </Stack>
  );
};

export default showCompletedUploadModal;
