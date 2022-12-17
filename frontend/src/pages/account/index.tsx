import {
  Anchor,
  Button,
  Center,
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  Tabs,
} from "@mantine/core";
import { Icon2fa, IconKey } from "@tabler/icons";
import { useForm, yupResolver } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { useRouter } from "next/router";
import * as yup from "yup";
import useUser from "../../hooks/user.hook";
import authService from "../../services/auth.service";
import userService from "../../services/user.service";
import toast from "../../utils/toast.util";
import showEnableTotpModal from "../../components/account/showEnableTotpModal";
import { showNotification } from "@mantine/notifications";
import { TbCheck } from "react-icons/tb";

const Account = () => {
  const user = useUser();
  const modals = useModals();
  const router = useRouter();

  const accountForm = useForm({
    initialValues: {
      username: user?.username,
      email: user?.email,
    },
    validate: yupResolver(
      yup.object().shape({
        email: yup.string().email(),
        username: yup.string().min(3),
      })
    ),
  });

  const passwordForm = useForm({
    initialValues: {
      oldPassword: "",
      password: "",
    },
    validate: yupResolver(
      yup.object().shape({
        oldPassword: yup.string().min(8),
        password: yup.string().min(8),
      })
    ),
  });

  const enableTotpForm = useForm({
    initialValues: {
      password: "",
    },
    validate: yupResolver(
      yup.object().shape({
        password: yup.string().min(8),
      })
    ),
  });

  const disableTotpForm = useForm({
    initialValues: {
      password: "",
      code: "",
    },
    validate: yupResolver(
      yup.object().shape({
        password: yup.string().min(8),
        code: yup
          .string()
          .min(6)
          .max(6)
          .matches(/^[0-9]+$/, { message: "Code must be a number" }),
      })
    ),
  });

  if (!user) {
    router.push("/");
    return;
  }

  return (
    <Container size="sm">
      <Title order={3} mb="xs">
        My account
      </Title>
      <Paper withBorder p="xl">
        <Title order={5} mb="xs">
          Account Info
        </Title>
        <form
          onSubmit={accountForm.onSubmit((values) =>
            userService
              .updateCurrentUser({
                username: values.username,
                email: values.email,
              })
              .then(() => toast.success("User updated successfully"))
              .catch(toast.axiosError)
          )}
        >
          <Stack>
            <TextInput
              label="Username"
              {...accountForm.getInputProps("username")}
            />
            <TextInput label="Email" {...accountForm.getInputProps("email")} />
            <Group position="right">
              <Button type="submit">Save</Button>
            </Group>
          </Stack>
        </form>
      </Paper>
      <Paper withBorder p="xl" mt="lg">
        <Title order={5} mb="xs">
          Password
        </Title>
        <form
          onSubmit={passwordForm.onSubmit((values) =>
            authService
              .updatePassword(values.oldPassword, values.password)
              .then(() => {
                toast.success("Password updated successfully");
                passwordForm.reset();
              })
              .catch(toast.axiosError)
          )}
        >
          <Stack>
            <PasswordInput
              label="Old password"
              {...passwordForm.getInputProps("oldPassword")}
            />
            <PasswordInput
              label="New password"
              {...passwordForm.getInputProps("password")}
            />
            <Group position="right">
              <Button type="submit">Save</Button>
            </Group>
          </Stack>
        </form>
      </Paper>

      <Paper withBorder p="xl" mt="lg">
        <Title order={5} mb="xs">
          Security
        </Title>

        <Tabs defaultValue="totp">
          <Tabs.List>
            <Tabs.Tab value="totp" icon={<Icon2fa size={14} />}>
              TOTP
            </Tabs.Tab>
            <Tabs.Tab value="u2f" icon={<IconKey size={14} />}>
              U2F
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="totp" pt="xs">
            {/* TODO: This is ugly, make it prettier */}
            {/* If we have totp enabled, show different text */}
            {user.totpVerified ? (
              <>
                <Text>Enter your current password to disable TOTP</Text>
                <form
                  onSubmit={disableTotpForm.onSubmit(async (values) => {
                    const result = await authService.disableTOTP(
                      values.code,
                      values.password
                    );
                    if (!result) {
                      showNotification({
                        icon: <TbCheck />,
                        color: "red",
                        radius: "md",
                        title: "Error",
                        message: "Invalid password or code",
                      });
                    } else {
                      showNotification({
                        icon: <TbCheck />,
                        color: "green",
                        radius: "md",
                        title: "Success",
                        message: "Successfully disabled TOTP",
                      });
                      values.password = "";
                      values.code = "";
                      // TODO: Update the form without reloading the page
                      window.location.reload();
                    }
                  })}
                >
                  <Stack>
                    <PasswordInput
                      label="Password"
                      {...disableTotpForm.getInputProps("password")}
                    />

                    <TextInput
                      variant="filled"
                      label="Code"
                      placeholder="******"
                      {...disableTotpForm.getInputProps("code")}
                    />

                    <Group position="right">
                      <Button color="red" type="submit">
                        Disable
                      </Button>
                    </Group>
                  </Stack>
                </form>
              </>
            ) : (
              <>
                <Text>Enter your current password to start enabling TOTP</Text>
                <form
                  onSubmit={enableTotpForm.onSubmit(async (values) => {
                    const result = await authService.enableTOTP(
                      values.password
                    );
                    if (!result) {
                      showNotification({
                        icon: <TbCheck />,
                        color: "red",
                        radius: "md",
                        title: "Error",
                        message: "Invalid password",
                      });
                    } else {
                      showEnableTotpModal(modals, {
                        qrCode: result.qrCode,
                        secret: result.totpSecret,
                        password: values.password,
                      });
                      values.password = "";
                    }
                  })}
                >
                  <Stack>
                    <PasswordInput
                      label="Password"
                      {...enableTotpForm.getInputProps("password")}
                    />
                    <Group position="right">
                      <Button type="submit">Start</Button>
                    </Group>
                  </Stack>
                </form>
              </>
            )}
          </Tabs.Panel>

          <Tabs.Panel value="u2f" pt="xs">
            Universal 2nd Factor (U2F) is a planned feature and is not
            implemented yet.
            <br />
            <Anchor
              href="https://github.com/stonith404/pingvin-share/issues/28"
              target="_blank"
            >
              GitHub Issue
            </Anchor>
          </Tabs.Panel>
        </Tabs>
      </Paper>

      <Center mt={80}>
        <Stack>
          <Button
            variant="light"
            color="red"
            onClick={() =>
              modals.openConfirmModal({
                title: "Account deletion",
                children: (
                  <Text size="sm">
                    Do you really want to delete your account including all your
                    active shares?
                  </Text>
                ),

                labels: { confirm: "Delete", cancel: "Cancel" },
                confirmProps: { color: "red" },
                onConfirm: async () => {
                  await userService.removeCurrentUser();
                  window.location.reload();
                },
              })
            }
          >
            Delete Account
          </Button>
        </Stack>
      </Center>
    </Container>
  );
};

export default Account;
