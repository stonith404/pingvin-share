import {
  Button,
  Center,
  Group,
  Image,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { FormattedMessage } from "react-intl";
import * as yup from "yup";
import useTranslate, {
  translateOutsideContext,
} from "../../hooks/useTranslate.hook";
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
  const t = translateOutsideContext();
  return modals.openModal({
    title: t("account.modal.totp.title"),
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
  const t = useTranslate();

  const validationSchema = yup.object().shape({
    code: yup
      .string()
      .min(6)
      .max(6)
      .required()
      .matches(/^[0-9]+$/, { message: "Code must be a number" }),
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
          <Text>
            <FormattedMessage id="account.modal.totp.step1" />
          </Text>
          <Image src={options.qrCode} alt="QR Code" />

          <Center>
            <span>
              {" "}
              <FormattedMessage id="common.text.or" />
            </span>
          </Center>

          <Tooltip label={t("account.modal.totp.clickToCopy")}>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(options.secret);
                toast.success("Copied to clipboard");
              }}
            >
              {options.secret}
            </Button>
          </Tooltip>
          <Center>
            <Text fz="xs"></Text>
          </Center>

          <Text>
            <FormattedMessage id="account.modal.totp.step2" />
          </Text>

          <form
            onSubmit={form.onSubmit((values) => {
              authService
                .verifyTOTP(values.code, options.password)
                .then(() => {
                  toast.success(t("account.notify.totp.enable"));
                  modals.closeAll();
                  refreshUser();
                })
                .catch(toast.axiosError);
            })}
          >
            <Group align="end">
              <TextInput
                style={{ flex: "1" }}
                variant="filled"
                label={t("account.modal.totp.code")}
                placeholder="******"
                {...form.getInputProps("code")}
              />

              <Button
                style={{ flex: "0 0 auto" }}
                variant="outline"
                type="submit"
              >
                <FormattedMessage id="account.modal.totp.verify" />
              </Button>
            </Group>
          </form>
        </Stack>
      </Center>
    </div>
  );
};

export default showEnableTotpModal;
