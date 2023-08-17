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
import { FormattedMessage } from "react-intl";
import * as yup from "yup";
import useTranslate from "../../../hooks/useTranslate.hook";
import userService from "../../../services/user.service";
import toast from "../../../utils/toast.util";

const showCreateUserModal = (
  modals: ModalsContextProps,
  smtpEnabled: boolean,
  getUsers: () => void,
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
  const t = useTranslate();
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
        email: yup.string().email(t("common.error.invalid-email")),
        username: yup
          .string()
          .min(3, t("common.error.too-short", { length: 3 })),
        password: yup
          .string()
          .min(8, t("common.error.too-short", { length: 8 }))
          .optional(),
      }),
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
          <TextInput
            label={t("admin.users.modal.create.username")}
            {...form.getInputProps("username")}
          />
          <TextInput
            label={t("admin.users.modal.create.email")}
            {...form.getInputProps("email")}
          />
          {smtpEnabled && (
            <Switch
              mt="xs"
              labelPosition="left"
              label={t("admin.users.modal.create.manual-password")}
              description={t(
                "admin.users.modal.create.manual-password.description",
              )}
              {...form.getInputProps("setPasswordManually", {
                type: "checkbox",
              })}
            />
          )}
          {(form.values.setPasswordManually || !smtpEnabled) && (
            <PasswordInput
              label={t("admin.users.modal.create.password")}
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
            label={t("admin.users.modal.create.admin")}
            description={t("admin.users.modal.create.admin.description")}
            {...form.getInputProps("isAdmin", { type: "checkbox" })}
          />
          <Group position="right">
            <Button type="submit">
              <FormattedMessage id="common.button.create" />
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
};

export default showCreateUserModal;
