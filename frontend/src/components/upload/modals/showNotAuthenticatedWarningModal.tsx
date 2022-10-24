import { Alert, Button, Stack } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { useRouter } from "next/router";
import { TbAlertCircle } from "react-icons/tb";

const showNotAuthenticatedWarningModal = (
  modals: ModalsContextProps,
  onConfirm: (...any: any) => any
) => {
  return modals.openConfirmModal({
    closeOnClickOutside: false,
    withCloseButton: false,
    closeOnEscape: false,
    labels: { confirm: "Continue", cancel: "Sign in" },
    onConfirm: onConfirm,
    onCancel: () => {},

    children: <Body />,
  });
};

const Body = () => {
  const modals = useModals();
  const router = useRouter();
  return (
    <>
      <Stack align="stretch">
        <Alert
          icon={<TbAlertCircle size={16} />}
          title="You're not signed in"
          color="yellow"
        >
          You will be unable to delete your share manually and view the visitor
          count if you're not signed in.
        </Alert>
      </Stack>
    </>
  );
};

export default showNotAuthenticatedWarningModal;
