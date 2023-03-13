import { Button, PasswordInput, Stack, Text } from "@mantine/core";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { useState } from "react";

const showEnterPasswordModal = (
  modals: ModalsContextProps,
  submitCallback: (password: string) => Promise<void>
) => {
  return modals.openModal({
    closeOnClickOutside: false,
    withCloseButton: false,
    closeOnEscape: false,
    title: "Password required",
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
  return (
    <Stack align="stretch">
      <Text size="sm">
        This access this share please enter the password for the share.
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
            placeholder="Password"
            error={passwordWrong && "Wrong password"}
            onFocus={() => setPasswordWrong(false)}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <Button type="submit">Submit</Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default showEnterPasswordModal;
