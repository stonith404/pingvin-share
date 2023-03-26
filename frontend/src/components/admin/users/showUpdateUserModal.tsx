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
    title: `升级 ${user.username}`,
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
            label="用户名"
            {...accountForm.getInputProps("username")}
          />
          <TextInput label="邮箱" {...accountForm.getInputProps("email")} />
          <Switch
            mt="xs"
            labelPosition="left"
            label="Admin privileges"
            {...accountForm.getInputProps("isAdmin", { type: "checkbox" })}
          />
        </Stack>
      </form>
      <Accordion>
        <Accordion.Item sx={{ borderBottom: "none" }} value="更改密码">
          <Accordion.Control px={0}>Change password</Accordion.Control>
          <Accordion.Panel>
            <form
              onSubmit={passwordForm.onSubmit(async (values) => {
                userService
                  .update(user.id, {
                    password: values.password,
                  })
                  .then(() => toast.success("密码更改成功"))
                  .catch(toast.axiosError);
              })}
            >
              <Stack>
                <PasswordInput
                  label="新密码"
                  {...passwordForm.getInputProps("password")}
                />
                <Button variant="light" type="submit">
                  保存新密码
                </Button>
              </Stack>
            </form>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Group position="right">
        <Button type="submit" form="accountForm">
          保存
        </Button>
      </Group>
    </Stack>
  );
};

export default showUpdateUserModal;
