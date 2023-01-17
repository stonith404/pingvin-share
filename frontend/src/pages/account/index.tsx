import {
  Button,
  Center,
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { useRouter } from "next/router";
import { Tb2Fa } from "react-icons/tb";
import * as yup from "yup";
import showEnableTotpModal from "../../components/account/showEnableTotpModal";
import ThemeSwitcher from "../../components/account/ThemeSwitcher";
import Meta from "../../components/Meta";
import useUser from "../../hooks/user.hook";
import authService from "../../services/auth.service";
import userService from "../../services/user.service";
import toast from "../../utils/toast.util";

const Account = () => {
  const { user, setUser } = useUser();
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

  const refreshUser = async () => setUser(await userService.getCurrentUser());

  if (!user) {
    router.push("/");
    return;
  }

  return (
    <>
      <Meta title="My account" />
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
              <TextInput
                label="Email"
                {...accountForm.getInputProps("email")}
              />
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
              <Tabs.Tab value="totp" icon={<Tb2Fa size={14} />}>
                TOTP
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="totp" pt="xs">
              {user.totpVerified ? (
                <>
                  <form
                    onSubmit={disableTotpForm.onSubmit((values) => {
                      authService
                        .disableTOTP(values.code, values.password)
                        .then(() => {
                          toast.success("Successfully disabled TOTP");
                          values.password = "";
                          values.code = "";
                          refreshUser();
                        })
                        .catch(toast.axiosError);
                    })}
                  >
                    <Stack>
                      <PasswordInput
                        description="Enter your current password to disable TOTP"
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
                  <form
                    onSubmit={enableTotpForm.onSubmit((values) => {
                      authService
                        .enableTOTP(values.password)
                        .then((result) => {
                          showEnableTotpModal(modals, refreshUser, {
                            qrCode: result.qrCode,
                            secret: result.totpSecret,
                            password: values.password,
                          });
                          values.password = "";
                        })
                        .catch(toast.axiosError);
                    })}
                  >
                    <Stack>
                      <PasswordInput
                        label="Password"
                        description="Enter your current password to start enabling TOTP"
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
          </Tabs>
        </Paper>
        <Paper withBorder p="xl" mt="lg">
          <Title order={5} mb="xs">
            Color scheme
          </Title>
          <ThemeSwitcher />
        </Paper>
        <Center mt={80} mb="lg">
          <Stack>
            <Button
              variant="light"
              color="red"
              onClick={() =>
                modals.openConfirmModal({
                  title: "Account deletion",
                  children: (
                    <Text size="sm">
                      Do you really want to delete your account including all
                      your active shares?
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
    </>
  );
};

export default Account;
