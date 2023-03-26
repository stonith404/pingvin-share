import {
  Button,
  Center,
  Col,
  Grid,
  Image,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import * as yup from "yup";
import authService from "../../services/auth.service";
import toast from "../../utils/toast.util";

const showEnableTotpModal = (
  modals: ModalsContextProps,
  refreshUser: () => {},
  options: {
    qrCode: string;
    secret: string;
    password: string;
  }
) => {
  return modals.openModal({
    title: "启用TOTP",
    children: (
      <CreateEnableTotpModal options={options} refreshUser={refreshUser} />
    ),
  });
};

const CreateEnableTotpModal = ({
  options,
  refreshUser,
}: {
  options: {
    qrCode: string;
    secret: string;
    password: string;
  };
  refreshUser: () => {};
}) => {
  const modals = useModals();

  const validationSchema = yup.object().shape({
    code: yup
      .string()
      .min(6)
      .max(6)
      .required()
      .matches(/^[0-9]+$/, { message: "代码必须是数字" }),
  });

  const form = useForm({
    initialValues: {
      code: "",
    },
    validate: yupResolver(validationSchema),
  });

  return (
    <div>
      <Center>
        <Stack>
          <Text>步骤1：添加您的验证器</Text>
          <Image src={options.qrCode} alt="QR 代码" />

          <Center>
            <span>或</span>
          </Center>

          <Tooltip label="单击以复制">
            <Button
              onClick={() => {
                navigator.clipboard.writeText(options.secret);
                toast.success("已复制到剪贴板");
              }}
            >
              {options.secret}
            </Button>
          </Tooltip>
          <Center>
            <Text fz="xs">手动输入</Text>
          </Center>

          <Text>第2步：验证代码</Text>

          <form
            onSubmit={form.onSubmit((values) => {
              authService
                .verifyTOTP(values.code, options.password)
                .then(() => {
                  toast.success("已成功启用TOTP");
                  modals.closeAll();
                  refreshUser();
                })
                .catch(toast.axiosError);
            })}
          >
            <Grid align="flex-end">
              <Col xs={9}>
                <TextInput
                  variant="filled"
                  label="代码"
                  placeholder="******"
                  {...form.getInputProps("code")}
                />
              </Col>
              <Col xs={3}>
                <Button variant="outline" type="submit">
                  验证
                </Button>
              </Col>
            </Grid>
          </form>
        </Stack>
      </Center>
    </div>
  );
};

export default showEnableTotpModal;
