import {
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
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { useRouter } from "next/router";
import * as yup from "yup";
import useUser from "../../hooks/user.hook";
import authService from "../../services/auth.service";
import userService from "../../services/user.service";
import toast from "../../utils/toast.util";

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
            <TextInput
              type="email"
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
      <Center mt={80}>
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
      </Center>
    </Container>
  );
};

export default Account;
