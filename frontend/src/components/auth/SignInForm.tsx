import {
  Anchor,
  Button,
  Container,
  createStyles,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { TbInfoCircle } from "react-icons/tb";
import { FormattedMessage } from "react-intl";
import * as yup from "yup";
import useConfig from "../../hooks/config.hook";
import useUser from "../../hooks/user.hook";
import useTranslate from "../../hooks/useTranslate.hook";
import authService from "../../services/auth.service";
import { getOAuthIcon, getOAuthUrl } from "../../utils/oauth.util";
import toast from "../../utils/toast.util";

const useStyles = createStyles((theme) => ({
  or: {
    "&:before": {
      content: "''",
      flex: 1,
      display: "block",
      borderTopWidth: 1,
      borderTopStyle: "solid",
      borderColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[4],
    },
    "&:after": {
      content: "''",
      flex: 1,
      display: "block",
      borderTopWidth: 1,
      borderTopStyle: "solid",
      borderColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[4],
    },
  },
}));

const SignInForm = ({ redirectPath }: { redirectPath: string }) => {
  const config = useConfig();
  const router = useRouter();
  const t = useTranslate();
  const { refreshUser } = useUser();
  const { classes } = useStyles();

  const [showTotp, setShowTotp] = React.useState(false);
  const [loginToken, setLoginToken] = React.useState("");
  const [oauth, setOAuth] = React.useState<string[]>([]);

  const validationSchema = yup.object().shape({
    emailOrUsername: yup.string().required(t("common.error.field-required")),
    password: yup
      .string()
      .min(8, t("common.error.too-short", { length: 8 }))
      .required(t("common.error.field-required")),
  });

  const form = useForm({
    initialValues: {
      emailOrUsername: "",
      password: "",
      totp: "",
    },
    validate: yupResolver(validationSchema),
  });

  const signIn = async (email: string, password: string) => {
    await authService
      .signIn(email, password)
      .then(async (response) => {
        if (response.data["loginToken"]) {
          // Prompt the user to enter their totp code
          setShowTotp(true);
          showNotification({
            icon: <TbInfoCircle />,
            color: "blue",
            radius: "md",
            title: t("signIn.notify.totp-required.title"),
            message: t("signIn.notify.totp-required.description"),
          });
          setLoginToken(response.data["loginToken"]);
        } else {
          await refreshUser();
          router.replace(redirectPath);
        }
      })
      .catch(toast.axiosError);
  };

  const signInTotp = (email: string, password: string, totp: string) => {
    authService
      .signInTotp(email, password, totp, loginToken)
      .then(async () => {
        await refreshUser();
        router.replace(redirectPath);
      })
      .catch((error) => {
        if (error?.response?.data?.error == "share_password_required") {
          toast.axiosError(error);
          // Refresh the page to start over
          window.location.reload();
        }

        toast.axiosError(error);
        form.setValues({ totp: "" });
      });
  };

  const getAvailableOAuth = async () => {
    const oauth = await authService.getAvailableOAuth();
    setOAuth(oauth.data);
  };

  React.useEffect(() => {
    getAvailableOAuth().catch(toast.axiosError);
  }, []);

  return (
    <Container size={420} my={40}>
      <Title order={2} align="center" weight={900}>
        <FormattedMessage id="signin.title" />
      </Title>
      {config.get("share.allowRegistration") && (
        <Text color="dimmed" size="sm" align="center" mt={5}>
          <FormattedMessage id="signin.description" />{" "}
          <Anchor component={Link} href={"signUp"} size="sm">
            <FormattedMessage id="signin.button.signup" />
          </Anchor>
        </Text>
      )}
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit((values) => {
            if (showTotp)
              signInTotp(values.emailOrUsername, values.password, values.totp);
            else signIn(values.emailOrUsername, values.password);
          })}
        >
          <TextInput
            label={t("signin.input.email-or-username")}
            placeholder={t("signin.input.email-or-username.placeholder")}
            {...form.getInputProps("emailOrUsername")}
          />
          <PasswordInput
            label={t("signin.input.password")}
            placeholder={t("signin.input.password.placeholder")}
            mt="md"
            {...form.getInputProps("password")}
          />
          {showTotp && (
            <TextInput
              variant="filled"
              label={t("account.modal.totp.code")}
              placeholder="******"
              mt="md"
              {...form.getInputProps("totp")}
            />
          )}
          {config.get("smtp.enabled") && (
            <Group position="right" mt="xs">
              <Anchor component={Link} href="/auth/resetPassword" size="xs">
                <FormattedMessage id="resetPassword.title" />
              </Anchor>
            </Group>
          )}
          <Button fullWidth mt="xl" type="submit">
            <FormattedMessage id="signin.button.submit" />
          </Button>
        </form>
        {oauth.length > 0 && (
          <Stack mt="xl">
            <Group align="center" className={classes.or}>
              <Text>{t("signIn.oauth.or")}</Text>
            </Group>
            <Group position="center">
              {oauth.map((provider) => (
                <Button
                  key={provider}
                  component="a"
                  target="_blank"
                  title={t(`signIn.oauth.${provider}`)}
                  href={getOAuthUrl(config.get("general.appUrl"), provider)}
                  variant="light"
                >
                  {getOAuthIcon(provider)}
                </Button>
              ))}
            </Group>
          </Stack>
        )}
      </Paper>
    </Container>
  );
};

export default SignInForm;
