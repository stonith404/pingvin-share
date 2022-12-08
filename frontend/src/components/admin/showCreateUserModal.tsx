import {
  Button,
  Group,
  PasswordInput,
  Stack,
  Switch,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import * as yup from "yup";
import userService from "../../services/user.service";
import toast from "../../utils/toast.util";

const showCreateUserModal = (
  modals: ModalsContextProps,
  getUsers: () => void
) => {
  return modals.openModal({
    title: <Title order={5}>Create user</Title>,
    children: <Body modals={modals} getUsers={getUsers} />,
  });
};

const Body = ({
  modals,
  getUsers,
}: {
  modals: ModalsContextProps;
  getUsers: () => void;
}) => {
  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      isAdmin: false,
    },
    validate: yupResolver(
      yup.object().shape({
        email: yup.string().email(),
        username: yup.string().min(3),
        password: yup.string().min(8),
      })
    ),
  });

  return (
    <Stack>
      <form
        onSubmit={form.onSubmit(async (values) => {
          console.log(values);
          userService
            .create(values)
            .then(() => {
              getUsers();
              modals.closeAll();
            })
            .catch(toast.axiosError);
        })}
      >
        <Stack>
          <TextInput label="Username" {...form.getInputProps("username")} />
          <TextInput label="Email" {...form.getInputProps("email")} />
          <PasswordInput
            label="New password"
            {...form.getInputProps("password")}
          />
          <Switch
            mt="xs"
            labelPosition="left"
            label="Admin privileges"
            {...form.getInputProps("isAdmin", { type: "checkbox" })}
          />
          <Group position="right">
            <Button type="submit">Create</Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
};

export default showCreateUserModal;
