import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/router";
import * as yup from "yup";
import useConfig from "../../hooks/config.hook";
import useUser from "../../hooks/user.hook";
import authService from "../../services/auth.service";
import toast from "../../utils/toast.util";

const SignUpForm = () => {
  const config = useConfig();
  const router = useRouter();
  const { refreshUser } = useUser();

  const validationSchema = yup.object().shape({
    email: yup.string().email().required(),
    username: yup.string().min(3).required(),
    password: yup.string().min(8).required(),
  });

  const form = useForm({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validate: yupResolver(validationSchema),
  });

  const signUp = async (email: string, username: string, password: string) => {
    await authService
      .signUp(email, username, password)
      .then(async () => {
        const user = await refreshUser();
        if (user?.isAdmin) {
          router.replace("/admin/intro");
        } else {
          router.replace("/upload");
        }
      })
      .catch(toast.axiosError);
  };

  return (
    <Container size={420} my={40}>
      <Title order={2} align="center" weight={900}>
        注册
      </Title>
      {config.get("share.allowRegistration") && (
        <Text color="dimmed" size="sm" align="center" mt={5}>
          你已经有了一个帐户?{" "}
          <Anchor component={Link} href={"signIn"} size="sm">
            登录
          </Anchor>
        </Text>
      )}
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit((values) =>
            signUp(values.email, values.username, values.password)
          )}
        >
          <TextInput
            label="用户名"
            placeholder="Your username"
            {...form.getInputProps("username")}
          />
          <TextInput
            label="邮箱"
            placeholder="Your email"
            mt="md"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="密码"
            placeholder="Your password"
            mt="md"
            {...form.getInputProps("password")}
          />
          <Button fullWidth mt="xl" type="submit">
            让我们开始吧
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default SignUpForm;
