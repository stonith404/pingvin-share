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
    title: "创建用户",
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
          <TextInput label="用户名" {...form.getInputProps("username")} />
          <TextInput label="邮箱" {...form.getInputProps("email")} />
          {smtpEnabled && (
            <Switch
              mt="xs"
              labelPosition="left"
              label="手动设置密码"
              description="如果未选中，用户将收到一封带有设置密码链接的电子邮件."
              {...form.getInputProps("setPasswordManually", {
                type: "checkbox",
              })}
            />
          )}
          {(form.values.setPasswordManually || !smtpEnabled) && (
            <PasswordInput
              label="密码"
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
            label="管理员权限"
            description="如果选中，用户将能够访问管理面板."
            {...form.getInputProps("isAdmin", { type: "checkbox" })}
          />
          <Group position="right">
            <Button type="submit">创建</Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
};

export default showCreateUserModal;
