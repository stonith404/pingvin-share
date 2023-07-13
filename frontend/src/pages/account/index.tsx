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
import { Tb2Fa } from "react-icons/tb";
import { FormattedMessage } from "react-intl";
import * as yup from "yup";
import Meta from "../../components/Meta";
import ThemeSwitcher from "../../components/account/ThemeSwitcher";
import showEnableTotpModal from "../../components/account/showEnableTotpModal";
import useTranslate from "../../hooks/useTranslate.hook";
import useUser from "../../hooks/user.hook";
import authService from "../../services/auth.service";
import userService from "../../services/user.service";
import toast from "../../utils/toast.util";

const Account = () => {
  const { user, refreshUser } = useUser();
  const modals = useModals();
  const t = useTranslate();

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

  return (
    <>
      <Meta title={t("account.title")} />
      <Container size="sm">
        <Title order={3} mb="xs">
          <FormattedMessage id="account.title" />
        </Title>
        <Paper withBorder p="xl">
          <Title order={5} mb="xs">
            <FormattedMessage id="account.card.info.title" />
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
                label={t("account.card.info.username")}
                {...accountForm.getInputProps("username")}
              />
              <TextInput
                label={t("account.card.info.email")}
                {...accountForm.getInputProps("email")}
              />
              <Group position="right">
                <Button type="submit">
                  <FormattedMessage id="common.button.save" />
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>
        <Paper withBorder p="xl" mt="lg">
          <Title order={5} mb="xs">
            <FormattedMessage id="account.card.password.title" />
          </Title>
          <form
            onSubmit={passwordForm.onSubmit((values) =>
              authService
                .updatePassword(values.oldPassword, values.password)
                .then(() => {
                  toast.success(t("account.notify.password.success"));
                  passwordForm.reset();
                })
                .catch(toast.axiosError)
            )}
          >
            <Stack>
              <PasswordInput
                label={t("account.card.password.old")}
                {...passwordForm.getInputProps("oldPassword")}
              />
              <PasswordInput
                label={t("account.card.password.new")}
                {...passwordForm.getInputProps("password")}
              />
              <Group position="right">
                <Button type="submit">
                  <FormattedMessage id="common.button.save" />
                </Button>
              </Group>
            </Stack>
          </form>
        </Paper>

        <Paper withBorder p="xl" mt="lg">
          <Title order={5} mb="xs">
            <FormattedMessage id="account.card.security.title" />
          </Title>

          <Tabs defaultValue="totp">
            <Tabs.List>
              <Tabs.Tab value="totp" icon={<Tb2Fa size={14} />}>
                TOTP
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="totp" pt="xs">
              {user!.totpVerified ? (
                <>
                  <form
                    onSubmit={disableTotpForm.onSubmit((values) => {
                      authService
                        .disableTOTP(values.code, values.password)
                        .then(() => {
                          toast.success(t("account.notify.totp.disable"));
                          values.password = "";
                          values.code = "";
                          refreshUser();
                        })
                        .catch(toast.axiosError);
                    })}
                  >
                    <Stack>
                      <PasswordInput
                        // TODO: Translate
                        description="Enter your current password to disable TOTP"
                        label={t("account.card.password.title")}
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
                        label={t("account.card.password.title")}
                        description={t(
                          "account.card.security.totp.enable.description"
                        )}
                        {...enableTotpForm.getInputProps("password")}
                      />
                      <Group position="right">
                        <Button type="submit">
                          <FormattedMessage id="account.card.security.totp.button.start" />
                        </Button>
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
            <FormattedMessage id="account.card.color.title" />
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
              <FormattedMessage id="account.button.delete" />
            </Button>
          </Stack>
        </Center>
      </Container>
    </>
  );
};

export default Account;
