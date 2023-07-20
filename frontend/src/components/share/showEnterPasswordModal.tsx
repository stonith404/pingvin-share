import { Button, PasswordInput, Stack, Text } from "@mantine/core";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { useState } from "react";
import { FormattedMessage } from "react-intl";
import useTranslate, {
  translateOutsideContext,
} from "../../hooks/useTranslate.hook";

const showEnterPasswordModal = (
  modals: ModalsContextProps,
  submitCallback: (password: string) => Promise<void>
) => {
  const t = translateOutsideContext();
  return modals.openModal({
    closeOnClickOutside: false,
    withCloseButton: false,
    closeOnEscape: false,
    title: t("share.modal.password.title"),
    children: <Body submitCallback={submitCallback} />,
  });
};

const Body = ({
  submitCallback,
}: {
  submitCallback: (password: string) => Promise<void>;
}) => {
  const [password, setPassword] = useState("");
  const [passwordWrong, setPasswordWrong] = useState(false);
  const t = useTranslate();
  return (
    <Stack align="stretch">
      <Text size="sm">
        <FormattedMessage id="share.modal.password.description" />
      </Text>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitCallback(password);
        }}
      >
        <Stack>
          <PasswordInput
            variant="filled"
            placeholder={t("share.modal.password")}
            error={passwordWrong && t("share.modal.error.invalid-password")}
            onFocus={() => setPasswordWrong(false)}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <Button type="submit">
            <FormattedMessage id="common.button.submit" />
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default showEnterPasswordModal;
