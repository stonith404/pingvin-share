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
import { useEffect, useState } from "react";
import { TbAuth2Fa } from "react-icons/tb";
import { FormattedMessage } from "react-intl";
import * as yup from "yup";
import Meta from "../../components/Meta";
import LanguagePicker from "../../components/account/LanguagePicker";
import ThemeSwitcher from "../../components/account/ThemeSwitcher";
import showEnableTotpModal from "../../components/account/showEnableTotpModal";
import useConfig from "../../hooks/config.hook";
import useTranslate from "../../hooks/useTranslate.hook";
import useUser from "../../hooks/user.hook";
import authService from "../../services/auth.service";
import userService from "../../services/user.service";
import { getOAuthIcon, getOAuthUrl, unlinkOAuth } from "../../utils/oauth.util";
import toast from "../../utils/toast.util";

const Account = () => {
  const [oauth, setOAuth] = useState<string[]>([]);
  const [oauthStatus, setOAuthStatus] = useState<Record<
    string,
    {
      provider: string;
      providerUsername: string;
    }
  > | null>(null);

  const { user, refreshUser } = useUser();
  const modals = useModals();
  const t = useTranslate();
  const config = useConfig();

  const accountForm = useForm({
    initialValues: {
      username: user?.username,
      email: user?.email,
    },
    validate: yupResolver(
      yup.object().shape({
        email: yup.string().email(t("common.error.invalid-email")),
        username: yup
          .string()
          .min(3, t("common.error.too-short", { length: 3 })),
      }),
    ),
  });

  const passwordForm = useForm({
    initialValues: {
      oldPassword: "",
      password: "",
    },
    validate: yupResolver(
      yup.object().shape({
        oldPassword: yup.string().when([], {
          is: () => !!user?.hasPassword,
          then: (schema) =>
            schema
              .min(8, t("common.error.too-short", { length: 8 }))
              .required(t("common.error.field-required")),
          otherwise: (schema) => schema.notRequired(),
        }),
        password: yup
          .string()
          .min(8, t("common.error.too-short", { length: 8 }))
          .required(t("common.error.field-required")),
      }),
    ),
  });

  const enableTotpForm = useForm({
    initialValues: {
      password: "",
    },
    validate: yupResolver(
      yup.object().shape({
        password: yup
          .string()
          .min(8, t("common.error.too-short", { length: 8 }))
          .required(t("common.error.field-required")),
      }),
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
          .min(6, t("common.error.exact-length", { length: 6 }))
          .max(6, t("common.error.exact-length", { length: 6 }))
          .matches(/^[0-9]+$/, { message: t("common.error.invalid-number") }),
      }),
    ),
  });

  const refreshOAuthStatus = () => {
    authService
      .getOAuthStatus()
      .then((data) => {
        setOAuthStatus(data.data);
      })
      .catch(toast.axiosError);
  };

  useEffect(() => {
    authService
      .getAvailableOAuth()
      .then((data) => {
        setOAuth(data.data);
      })
      .catch(toast.axiosError);
    refreshOAuthStatus();
  }, []);

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
                .then(() => toast.success(t("account.notify.info.success")))
                .catch(toast.axiosError),
            )}
          >
            <Stack>
              <TextInput
                label={t("account.card.info.username")}
                disabled={user?.isLdap}
                {...accountForm.getInputProps("username")}
              />
              <TextInput
                label={t("account.card.info.email")}
                disabled={user?.isLdap}
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
        {user?.isLdap ? null : (
          <Paper withBorder p="xl" mt="lg">
            <Title order={5} mb="xs">
              <FormattedMessage id="account.card.password.title" />
            </Title>
            <form
              onSubmit={passwordForm.onSubmit((values) =>
                authService
                  .updatePassword(values.oldPassword, values.password)
                  .then(async () => {
                    refreshUser();
                    toast.success(t("account.notify.password.success"));
                    passwordForm.reset();
                  })
                  .catch(toast.axiosError),
              )}
            >
              <Stack>
                {user?.hasPassword ? (
                  <PasswordInput
                    label={t("account.card.password.old")}
                    {...passwordForm.getInputProps("oldPassword")}
                  />
                ) : (
                  <Text size="sm" color="dimmed">
                    <FormattedMessage id="account.card.password.noPasswordSet" />
                  </Text>
                )}
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
        )}
        {oauth.length > 0 && (
          <Paper withBorder p="xl" mt="lg">
            <Title order={5} mb="xs">
              <FormattedMessage id="account.card.oauth.title" />
            </Title>

            <Tabs defaultValue={oauth[0] || ""}>
              <Tabs.List>
                {oauth.map((provider) => (
                  <Tabs.Tab
                    value={provider}
                    icon={getOAuthIcon(provider)}
                    key={provider}
                  >
                    {t(`account.card.oauth.${provider}`)}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
              {oauth.map((provider) => (
                <Tabs.Panel value={provider} pt="xs" key={provider}>
                  <Group position="apart">
                    <Text>
                      {oauthStatus?.[provider]
                        ? oauthStatus[provider].providerUsername
                        : t("account.card.oauth.unlinked")}
                    </Text>
                    {oauthStatus?.[provider] ? (
                      <Button
                        onClick={() => {
                          modals.openConfirmModal({
                            title: t("account.modal.unlink.title"),
                            children: (
                              <Text>
                                {t("account.modal.unlink.description")}
                              </Text>
                            ),
                            labels: {
                              confirm: t("account.card.oauth.unlink"),
                              cancel: t("common.button.cancel"),
                            },
                            confirmProps: { color: "red" },
                            onConfirm: () => {
                              unlinkOAuth(provider)
                                .then(() => {
                                  toast.success(
                                    t("account.notify.oauth.unlinked.success"),
                                  );
                                  refreshOAuthStatus();
                                })
                                .catch(toast.axiosError);
                            },
                          });
                        }}
                      >
                        {t("account.card.oauth.unlink")}
                      </Button>
                    ) : (
                      <Button
                        component="a"
                        href={getOAuthUrl(
                          config.get("general.appUrl"),
                          provider,
                        )}
                      >
                        {t("account.card.oauth.link")}
                      </Button>
                    )}
                  </Group>
                </Tabs.Panel>
              ))}
            </Tabs>
          </Paper>
        )}
        <Paper withBorder p="xl" mt="lg">
          <Title order={5} mb="xs">
            <FormattedMessage id="account.card.security.title" />
          </Title>

          <Tabs defaultValue="totp">
            <Tabs.List>
              <Tabs.Tab value="totp" icon={<TbAuth2Fa size={14} />}>
                TOTP
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="totp" pt="xs">
              {user?.totpVerified ? (
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
                        description={t(
                          "account.card.security.totp.disable.description",
                        )}
                        label={t("account.card.password.title")}
                        {...disableTotpForm.getInputProps("password")}
                      />

                      <TextInput
                        variant="filled"
                        label={t("account.modal.totp.code")}
                        placeholder="******"
                        {...disableTotpForm.getInputProps("code")}
                      />

                      <Group position="right">
                        <Button color="red" type="submit">
                          <FormattedMessage id="common.button.disable" />
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
                          "account.card.security.totp.enable.description",
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
            <FormattedMessage id="account.card.language.title" />
          </Title>
          <LanguagePicker />
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
                  title: t("account.modal.delete.title"),
                  children: (
                    <Text size="sm">
                      <FormattedMessage id="account.modal.delete.description" />
                    </Text>
                  ),

                  labels: {
                    confirm: t("common.button.delete"),
                    cancel: t("common.button.cancel"),
                  },
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
