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
    title: "需要密码",
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
        此访问此共享请输入共享的密码.
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
          <Button type="submit">提交</Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default showEnterPasswordModal;
