import {
  Button,
  Center,
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { Tb2Fa } from "react-icons/tb";
import * as yup from "yup";
import showEnableTotpModal from "../../components/account/showEnableTotpModal";
import ThemeSwitcher from "../../components/account/ThemeSwitcher";
import Meta from "../../components/Meta";
import useUser from "../../hooks/user.hook";
import authService from "../../services/auth.service";
import userService from "../../services/user.service";
import toast from "../../utils/toast.util";

const Account = () => {
  const { user, refreshUser } = useUser();
  const modals = useModals();

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

  const enableTotpForm = useForm({
    initialValues: {
      password: "",
    },
    validate: yupResolver(
      yup.object().shape({
        password: yup.string().min(8),
      })
    ),
  });

  const disableTotpForm = useForm({
    initialValues: {
      password: "",
      code: "",
    },
    validate: yupResolver(
      yup.object().shape({
        password: yup.string().min(8),
        code: yup
          .string()
          .min(6)
          .max(6)
          .matches(/^[0-9]+$/, { message: "代码必须是数字" }),
      })
    ),
  });

  return (
    <>
      <Meta title="我的账户" />
      <Container size="sm">
        <Title order={3} mb="xs">
          我的账户
        </Title>
        <Paper withBorder p="xl">
          <Title order={5} mb="xs">
            账户信息
          </Title>
          <form
            onSubmit={accountForm.onSubmit((values) =>
              userService
                .updateCurrentUser({
                  username: values.username,
                  email: values.email,
                })
                .then(() => toast.success("用户更新成功"))
                .catch(toast.axiosError)
            )}
          >
            <Stack>
              <TextInput
                label="用户名"
                {...accountForm.getInputProps("username")}
              />
              <TextInput
                label="邮箱"
                {...accountForm.getInputProps("email")}
              />
              <Group position="right">
                <Button type="submit">保存</Button>
              </Group>
            </Stack>
          </form>
        </Paper>
        <Paper withBorder p="xl" mt="lg">
          <Title order={5} mb="xs">
            密码
          </Title>
          <form
            onSubmit={passwordForm.onSubmit((values) =>
              authService
                .updatePassword(values.oldPassword, values.password)
                .then(() => {
                  toast.success("密码更新成功");
                  passwordForm.reset();
                })
                .catch(toast.axiosError)
            )}
          >
            <Stack>
              <PasswordInput
                label="旧密码"
                {...passwordForm.getInputProps("oldPassword")}
              />
              <PasswordInput
                label="新密码"
                {...passwordForm.getInputProps("password")}
              />
              <Group position="right">
                <Button type="submit">保存</Button>
              </Group>
            </Stack>
          </form>
        </Paper>

        <Paper withBorder p="xl" mt="lg">
          <Title order={5} mb="xs">
            安全
          </Title>

          <Tabs defaultValue="totp">
            <Tabs.List>
              <Tabs.Tab value="totp" icon={<Tb2Fa size={14} />}>
                TOTP
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="totp" pt="xs">
              {user!.totpVerified ? (
                <>
                  <form
                    onSubmit={disableTotpForm.onSubmit((values) => {
                      authService
                        .disableTOTP(values.code, values.password)
                        .then(() => {
                          toast.success("已成功禁用TOTP");
                          values.password = "";
                          values.code = "";
                          refreshUser();
                        })
                        .catch(toast.axiosError);
                    })}
                  >
                    <Stack>
                      <PasswordInput
                        description="输入当前密码以禁用TOTP"
                        label="密码"
                        {...disableTotpForm.getInputProps("password")}
                      />

                      <TextInput
                        variant="filled"
                        label="代码"
                        placeholder="******"
                        {...disableTotpForm.getInputProps("code")}
                      />

                      <Group position="right">
                        <Button color="red" type="submit">
                          禁用
                        </Button>
                      </Group>
                    </Stack>
                  </form>
                </>
              ) : (
                <>
                  <form
                    onSubmit={enableTotpForm.onSubmit((values) => {
                      authService
                        .enableTOTP(values.password)
                        .then((result) => {
                          showEnableTotpModal(modals, refreshUser, {
                            qrCode: result.qrCode,
                            secret: result.totpSecret,
                            password: values.password,
                          });
                          values.password = "";
                        })
                        .catch(toast.axiosError);
                    })}
                  >
                    <Stack>
                      <PasswordInput
                        label="密码"
                        description="输入当前密码以开始启用TOTP"
                        {...enableTotpForm.getInputProps("password")}
                      />
                      <Group position="right">
                        <Button type="submit">Start</Button>
                      </Group>
                    </Stack>
                  </form>
                </>
              )}
            </Tabs.Panel>
          </Tabs>
        </Paper>
        <Paper withBorder p="xl" mt="lg">
          <Title order={5} mb="xs">
            配色方案
          </Title>
          <ThemeSwitcher />
        </Paper>
        <Center mt={80} mb="lg">
          <Stack>
            <Button
              variant="light"
              color="red"
              onClick={() =>
                modals.openConfirmModal({
                  title: "账户删除",
                  children: (
                    <Text size="sm">
                      你真的想删除你的帐户吗？包括所有您的活跃分享?
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
              删除账户
            </Button>
          </Stack>
        </Center>
      </Container>
    </>
  );
};

export default Account;
