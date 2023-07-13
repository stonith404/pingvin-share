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
import { FormattedMessage } from "react-intl";
import * as yup from "yup";
import useTranslate from "../../../hooks/useTranslate.hook";
import userService from "../../../services/user.service";
import User from "../../../types/user.type";
import toast from "../../../utils/toast.util";

const showUpdateUserModal = (
  modals: ModalsContextProps,
  user: User,
  getUsers: () => void
) => {
  // TODO: Figure out how to get the intl object here
  // We can't use hooks since this is not a component
  // And we can't just render the <FormattedMessage> component because its out of context
  console.log(<FormattedMessage id="admin.users.edit.update.title" />);

  return modals.openModal({
    // Set the title to the rendered formatted message components + the username
    title:
      <FormattedMessage id="admin.users.edit.update.title" /> +
      " " +
      user.username,
    // title: `${t( "admin.users.edit.update.title")} ${user.username}`,
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
  const t = useTranslate();

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
            label={t("admin.users.table.username")}
            {...accountForm.getInputProps("username")}
          />
          <TextInput
            label={t("admin.users.table.email")}
            {...accountForm.getInputProps("email")}
          />
          <Switch
            mt="xs"
            labelPosition="left"
            label={t("admin.users.edit.update.admin-privileges")}
            {...accountForm.getInputProps("isAdmin", { type: "checkbox" })}
          />
        </Stack>
      </form>
      <Accordion>
        <Accordion.Item sx={{ borderBottom: "none" }} value="changePassword">
          <Accordion.Control px={0}>
            <FormattedMessage id="admin.users.edit.update.change-password.title" />
          </Accordion.Control>
          <Accordion.Panel>
            <form
              onSubmit={passwordForm.onSubmit(async (values) => {
                userService
                  .update(user.id, {
                    password: values.password,
                  })
                  .then(() =>
                    toast.success(
                      t("admin.users.edit.update.notify.password.success")
                    )
                  )
                  .catch(toast.axiosError);
              })}
            >
              <Stack>
                <PasswordInput
                  label={t("admin.users.edit.update.change-password.field")}
                  {...passwordForm.getInputProps("password")}
                />
                <Button variant="light" type="submit">
                  <FormattedMessage id="admin.users.edit.update.change-password.button" />
                </Button>
              </Stack>
            </form>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Group position="right">
        <Button type="submit" form="accountForm">
          <FormattedMessage id="common.button.save" />
        </Button>
      </Group>
    </Stack>
  );
};

export default showUpdateUserModal;
