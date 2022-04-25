import { Button, Group, PasswordInput, Text, Title } from "@mantine/core";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { useState } from "react";

const showEnterPasswordModal = (
  modals: ModalsContextProps,
  submitCallback: any
) => {
  return modals.openModal({
    closeOnClickOutside: false,
    withCloseButton: false,
    closeOnEscape: false,
    title: (
      <>
        <Title order={4}>Password required</Title>
        <Text size="sm">
          This access this share please enter the password for the share.
        </Text>
      </>
    ),
    children: <Body submitCallback={submitCallback} />,
  });
};

const Body = ({ submitCallback }: { submitCallback: any }) => {
  const [password, setPassword] = useState("");
  const [passwordWrong, setPasswordWrong] = useState(false);
  return (
    <>
      <Group grow direction="column">
        <PasswordInput
          variant="filled"
          placeholder="Password"
          error={passwordWrong && "Wrong password"}
          onFocus={() => setPasswordWrong(false)}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <Button
          onClick={() =>
            submitCallback(password)
              .then((res: any) => res)
              .catch((e: any) => {
                const error = e.response.data.message;
                if (error == "wrong_password") {
                  setPasswordWrong(true);
                }
              })
          }
        >
          Submit
        </Button>
      </Group>
    </>
  );
};

export default showEnterPasswordModal;
