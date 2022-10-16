import { Button, PasswordInput, Stack, Text, Title } from "@mantine/core";
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
      <Stack align="stretch">
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
                if (error == "Wrong password") {
                  setPasswordWrong(true);
                }
              })
          }
        >
          Submit
        </Button>
      </Stack>
    </>
  );
};

export default showEnterPasswordModal;
