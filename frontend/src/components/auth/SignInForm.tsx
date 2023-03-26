import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
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
import * as yup from "yup";
import useConfig from "../../hooks/config.hook";
import useUser from "../../hooks/user.hook";
import authService from "../../services/auth.service";
import toast from "../../utils/toast.util";

const SignInForm = ({ redirectPath }: { redirectPath: string }) => {
  const config = useConfig();
  const router = useRouter();
  const { refreshUser } = useUser();

  const [showTotp, setShowTotp] = React.useState(false);
  const [loginToken, setLoginToken] = React.useState("");

  const validationSchema = yup.object().shape({
    emailOrUsername: yup.string().required(),
    password: yup.string().min(8).required(),
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
            title: "需要双因素身份验证",
            message: "请输入您的双因素身份验证码",
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

  return (
    <Container size={420} my={40}>
      <Title order={2} align="center" weight={900}>
        欢迎回来
      </Title>
      {config.get("share.allowRegistration") && (
        <Text color="dimmed" size="sm" align="center" mt={5}>
          你还没有账户吗？{" "}
          <Anchor component={Link} href={"signUp"} size="sm">
            {"Sign up"}
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
            label="电子邮件或用户名"
            placeholder="Your email or username"
            {...form.getInputProps("emailOrUsername")}
          />
          <PasswordInput
            label="密码"
            placeholder="Your password"
            mt="md"
            {...form.getInputProps("password")}
          />
          {showTotp && (
            <TextInput
              variant="filled"
              label="代码"
              placeholder="******"
              mt="md"
              {...form.getInputProps("totp")}
            />
          )}
          {config.get("smtp.enabled") && (
            <Group position="right" mt="xs">
              <Anchor component={Link} href="/auth/resetPassword" size="xs">
                忘记密码?
              </Anchor>
            </Group>
          )}
          <Button fullWidth mt="xl" type="submit">
            登录
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default SignInForm;
