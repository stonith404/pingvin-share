import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  createStyles,
  Group,
  Paper,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/router";
import { TbArrowLeft } from "react-icons/tb";
import * as yup from "yup";
import authService from "../../../services/auth.service";
import toast from "../../../utils/toast.util";

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 26,
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  controls: {
    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column-reverse",
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      width: "100%",
      textAlign: "center",
    },
  },
}));

const ResetPassword = () => {
  const { classes } = useStyles();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: yupResolver(
      yup.object().shape({
        email: yup.string().email().required(),
      })
    ),
  });

  return (
    <Container size={460} my={30}>
      <Title order={2} weight={900} align="center">
        忘记密码?
      </Title>
      <Text color="dimmed" size="sm" align="center">
        输入您的电子邮件以获取重置链接
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <form
          onSubmit={form.onSubmit((values) =>
            authService
              .requestResetPassword(values.email)
              .then(() => {
                toast.success("电子邮件已发送.");
                router.push("/auth/signIn");
              })
              .catch(toast.axiosError)
          )}
        >
          <TextInput
            label="你的邮箱"
            placeholder="Your email"
            {...form.getInputProps("email")}
          />
          <Group position="apart" mt="lg" className={classes.controls}>
            <Anchor
              component={Link}
              color="dimmed"
              size="sm"
              className={classes.control}
              href={"/auth/signIn"}
            >
              <Center inline>
                <TbArrowLeft size={12} />
                <Box ml={5}>返回登录页面</Box>
              </Center>
            </Anchor>
            <Button type="submit" className={classes.control}>
              重置密码
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
};

export default ResetPassword;
