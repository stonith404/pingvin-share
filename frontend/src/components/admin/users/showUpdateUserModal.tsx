import {
  Accordion,
  Button,
  Group,
  PasswordInput,
  Stack,
  Switch,
  TextInput,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import * as yup from "yup";
import userService from "../../../services/user.service";
import User from "../../../types/user.type";
import toast from "../../../utils/toast.util";

const showUpdateUserModal = (
  modals: ModalsContextProps,
  user: User,
  getUsers: () => void
) => {
  return modals.openModal({
    title: `Update ${user.username}`,
    children: <Body user={user} modals={modals} getUsers={getUsers} />,
  });
};

const Body = ({
  user,
  modals,
  getUsers,
}: {
  modals: ModalsContextProps;
  user: User;
  getUsers: () => void;
}) => {
  const accountForm = useForm({
    initialValues: {
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
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
      password: "",
    },
    validate: yupResolver(
      yup.object().shape({
        password: yup.string().min(8),
      })
    ),
  });

  return (
    <Stack>
      <form
        id="accountForm"
        onSubmit={accountForm.onSubmit(async (values) => {
          userService
            .update(user.id, values)
            .then(() => {
              getUsers();
              modals.closeAll();
            })
            .catch(toast.axiosError);
        })}
      >
        <Stack>
          <TextInput
            label="Username"
            {...accountForm.getInputProps("username")}
          />
          <TextInput label="Email" {...accountForm.getInputProps("email")} />
          <Switch
            mt="xs"
            labelPosition="left"
            label="Admin privileges"
            {...accountForm.getInputProps("isAdmin", { type: "checkbox" })}
          />
        </Stack>
      </form>
      <Accordion>
        <Accordion.Item sx={{ borderBottom: "none" }} value="changePassword">
          <Accordion.Control px={0}>Change password</Accordion.Control>
          <Accordion.Panel>
            <form
              onSubmit={passwordForm.onSubmit(async (values) => {
                userService
                  .update(user.id, {
                    password: values.password,
                  })
                  .then(() => toast.success("Password changed successfully"))
                  .catch(toast.axiosError);
              })}
            >
              <Stack>
                <PasswordInput
                  label="New password"
                  {...passwordForm.getInputProps("password")}
                />
                <Button variant="light" type="submit">
                  Save new password
                </Button>
              </Stack>
            </form>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Group position="right">
        <Button type="submit" form="accountForm">
          Save
        </Button>
      </Group>
    </Stack>
  );
};

export default showUpdateUserModal;
