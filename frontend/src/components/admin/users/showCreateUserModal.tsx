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
import {FormattedMessage, useIntl} from "react-intl";

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

  const intl = useIntl();

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
          <TextInput label={intl.formatMessage({id:"admin.users.modal.create.username"})} {...form.getInputProps("username")} />
          <TextInput label={intl.formatMessage({id:"admin.users.modal.create.email"})} {...form.getInputProps("email")} />
          {smtpEnabled && (
            <Switch
              mt="xs"
              labelPosition="left"
              label={intl.formatMessage({id:"admin.users.modal.create.manual-password"})}
              description={intl.formatMessage({id:"admin.users.modal.create.manual-password.description"})}
              {...form.getInputProps("setPasswordManually", {
                type: "checkbox",
              })}
            />
          )}
          {(form.values.setPasswordManually || !smtpEnabled) && (
            <PasswordInput
              label={intl.formatMessage({id:"admin.users.modal.create.password"})}
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
            label={intl.formatMessage({id:"admin.users.modal.create.admin"})}
            description={intl.formatMessage({id:"admin.users.modal.create.admin.description"})}
            {...form.getInputProps("isAdmin", { type: "checkbox" })}
          />
          <Group position="right">
            <Button type="submit"><FormattedMessage id="common.button.create" /></Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
};

export default showCreateUserModal;
