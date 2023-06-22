import { ActionIcon, Button, Stack, Text, TextInput } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import moment from "moment";
import { useRouter } from "next/router";
import { TbCopy } from "react-icons/tb";
import { useState } from "react";
import { Share } from "../../../types/share.type";
import toast from "../../../utils/toast.util";

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
  const clipboard = useClipboard({ timeout: 500 });
  const modals = useModals();
  const router = useRouter();
  const [linkClicked, setLinkClicked] = useState(false);

  const link = `${appUrl}/share/${share.id}`;
  return (
    <Stack align="stretch">
      <TextInput
        readOnly
        variant="filled"
        style={{ borderColor: "green" }}
        value={link}
        onClick={() => {
            if (linkClicked) return;
            clipboard.copy(link);
            toast.success("Your link was copied to the keyboard.");
            setLinkClicked(true);
        }}
        rightSection={
          window.isSecureContext && (
            <ActionIcon
              onClick={() => {
                clipboard.copy(link);
                toast.success("Your link was copied to the keyboard.");
                setLinkClicked(true);
              }}
            >
              <TbCopy />
            </ActionIcon>
          )
        }
      />
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
        Done
      </Button>
    </Stack>
  );
};

export default showCompletedUploadModal;
