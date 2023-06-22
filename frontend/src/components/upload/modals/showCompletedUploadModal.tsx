import { ActionIcon, Button, Stack, Text, TextInput } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import moment from "moment";
import { useRouter } from "next/router";
import { TbCopy, TbChecks } from "react-icons/tb";
import { useState, useRef } from "react";
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

  const [checkState, setCheckState] = useState(false);
  const timerRef = useRef<number | ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const link = `${appUrl}/share/${share.id}`;

  const copyLink = () => {
    clipboard.copy(link);
    toast.success("Your link was copied to the keyboard.");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCheckState(false);
    }, 1500);
    setCheckState(true);
  };

  return (
    <Stack align="stretch">
      <TextInput
        readOnly
        variant="filled"
        value={link}
        onClick={copyLink}
        rightSection={
          window.isSecureContext && (
            <ActionIcon onClick={copyLink}>
              {checkState ? <TbChecks /> : <TbCopy />}
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
