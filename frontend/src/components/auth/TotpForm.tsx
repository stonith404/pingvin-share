import { Button, Container, Group, Paper, PinInput, Title } from "@mantine/core";
import { FormattedMessage } from "react-intl";
import * as yup from "yup";
import useTranslate from "../../hooks/useTranslate.hook";
import { useForm, yupResolver } from "@mantine/form";
import { useState } from "react";
import authService from "../../services/auth.service";
import toast from "../../utils/toast.util";
import { useRouter } from "next/router";
import useUser from "../../hooks/user.hook";

function TotpForm({ redirectPath }: { redirectPath: string }) {
  const t = useTranslate();
  const router = useRouter();
  const { refreshUser } = useUser();

  const [loading, setLoading] = useState(false);

  const validationSchema = yup.object().shape({
    code: yup
      .string()
      .min(6, t("common.error.too-short", { length: 6 }))
      .required(t("common.error.field-required")),
  });

  const form = useForm({
    initialValues: {
      code: "",
    },
    validate: yupResolver(validationSchema),
  });

  const onSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await authService.signInTotp(form.values.code, router.query.loginToken as string);
      await refreshUser();
      await router.replace(redirectPath);
    } catch (e) {
      toast.axiosError(e);
      form.setFieldError('code', "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container size={420} my={40}>
      <Title order={2} align="center" weight={900}>
        <FormattedMessage id="totp.title" />
      </Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <Group position="center">
            <PinInput length={6} oneTimeCode aria-label="One time code" autoFocus={true}
                      onComplete={onSubmit}
                      {...form.getInputProps("code")} />
            <Button mt="md" type="submit" loading={loading}>Login</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}

export default TotpForm;