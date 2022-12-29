import { Box, Stack, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
import AdminConfigTable from "../../components/admin/AdminConfigTable";
import Logo from "../../components/Logo";
import useConfig from "../../hooks/config.hook";
import useUser from "../../hooks/user.hook";

const Setup = () => {
  const router = useRouter();
  const config = useConfig();
  const { user } = useUser();

  if (!user) {
    router.push("/auth/signUp");
    return;
  } else if (config.get("SETUP_FINISHED")) {
    router.push("/");
    return;
  }

  return (
    <>
      <Stack align="center">
        <Logo height={80} width={80} />
        <Title order={2}>Welcome to Pingvin Share</Title>
        <Text>Let's customize Pingvin Share for you! </Text>
        <Box style={{ width: "100%" }}>
          <AdminConfigTable />
        </Box>
      </Stack>
    </>
  );
};

export default Setup;
