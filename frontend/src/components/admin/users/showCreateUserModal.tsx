import {
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
import toast from "../../../utils/toast.util";

const showCreateUserModal = (
  modals: ModalsContextProps,
  smtpEnabled: boolean,
  getUsers: () => void
) => {
  return modals.openModal({
    title: "Create user",
    children: (
      <Body modals={modals} smtpEnabled={smtpEnabled} getUsers={getUsers} />
    ),
  });
};

const Body = ({
  modals,
  smtpEnabled,
  getUsers,
}: {
  modals: ModalsContextProps;
  smtpEnabled: boolean;
  getUsers: () => void;
}) => {
  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: undefined,
      isAdmin: false,
      setPasswordManually: false,
    },
    validate: yupResolver(
      yup.object().shape({
        email: yup.string().email(),
        username: yup.string().min(3),
        password: yup.string().min(8).optional(),
      })
    ),
  });

  return (
    <Stack>
      <form
        onSubmit={form.onSubmit(async (values) => {
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
          {smtpEnabled && (
            <Switch
              mt="xs"
              labelPosition="left"
              label="Set password manually"
              description="If not checked, the user will receive an email with a link to set their password."
              {...form.getInputProps("setPasswordManually", {
                type: "checkbox",
              })}
            />
          )}
          {(form.values.setPasswordManually || !smtpEnabled) && (
            <PasswordInput
              label="Password"
              {...form.getInputProps("password")}
            />
          )}
          <Switch
            styles={{
              body: {
                display: "flex",
                justifyContent: "space-between",
              },
            }}
            mt="xs"
            labelPosition="left"
            label="Admin privileges"
            description="If checked, the user will be able to access the admin panel."
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
