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
import * as yup from "yup";
import useConfig from "../../hooks/config.hook";
import authService from "../../services/auth.service";
import toast from "../../utils/toast.util";

const SignInForm = () => {
  const config = useConfig();

  const validationSchema = yup.object().shape({
    emailOrUsername: yup.string().required(),
    password: yup.string().min(8).required(),
  });

  const form = useForm({
    initialValues: {
      emailOrUsername: "",
      password: "",
    },
    validate: yupResolver(validationSchema),
  });

  const signIn = (email: string, password: string) => {
    authService
      .signIn(email, password)
      .then(() => window.location.replace("/"))
      .catch((e) => toast.error(e.response.data.message));
  };

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Welcome back
      </Title>
      {config.get("allowRegistration") && (
        <Text color="dimmed" size="sm" align="center" mt={5}>
          You don't have an account yet?{" "}
          <Anchor component={Link} href={"signUp"} size="sm">
            {"Sign up"}
          </Anchor>
        </Text>
      )}
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit((values) =>
            signIn(values.emailOrUsername, values.password)
          )}
        >
          <TextInput
            label="Email or username"
            placeholder="you@email.com"
            {...form.getInputProps("emailOrUsername")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            {...form.getInputProps("password")}
          />
          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default SignInForm;
