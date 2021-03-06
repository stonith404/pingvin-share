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
import * as yup from "yup";
import aw from "../../utils/appwrite.util";
import { useConfig } from "../../utils/config.util";
import toast from "../../utils/toast.util";

const AuthForm = ({ mode }: { mode: "signUp" | "signIn" }) => {
  const config = useConfig();
  const validationSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().min(8).required(),
  });

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    schema: yupResolver(validationSchema),
  });

  const signIn = (email: string, password: string) => {
    aw.account
      .createSession(email, password)
      .then(() => window.location.replace("/upload"))
      .catch((e) => toast.error(e.message));
  };
  const signUp = (email: string, password: string) => {
    aw.account
      .create("unique()", email, password)
      .then(() => signIn(email, password))
      .catch((e) => toast.error(e.message));
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
        {mode == "signUp" ? "Sign up" : "Welcome back"}
      </Title>
      {!config.DISABLE_REGISTRATION && (
        <Text color="dimmed" size="sm" align="center" mt={5}>
          {mode == "signUp"
            ? "You have an account already?"
            : "You don't have an account yet?"}{" "}
          <Anchor href={mode == "signUp" ? "signIn" : "signUp"} size="sm">
            {mode == "signUp" ? "Sign in" : "Sign up"}
          </Anchor>
        </Text>
      )}
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form
          onSubmit={form.onSubmit((values) =>
            mode == "signIn"
              ? signIn(values.email, values.password)
              : signUp(values.email, values.password)
          )}
        >
          <TextInput
            label="Email"
            placeholder="you@email.com"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            {...form.getInputProps("password")}
          />
          <Button fullWidth mt="xl" type="submit">
            {mode == "signUp" ? "Let's get started" : "Sign in"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AuthForm;
