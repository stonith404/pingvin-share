import { Button, Stack, Text, Title } from "@mantine/core";
import { useRouter } from "next/router";
import { useState } from "react";
import AdminConfigTable from "../../components/admin/AdminConfigTable";
import Logo from "../../components/Logo";
import useConfig from "../../hooks/config.hook";
import useUser from "../../hooks/user.hook";
import configService from "../../services/config.service";

const Setup = () => {
  const router = useRouter();
  const config = useConfig();
  const user = useUser();

  const [isLoading, setIsLoading] = useState(false);

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
        <AdminConfigTable />
        <Button
          loading={isLoading}
          onClick={async () => {
            setIsLoading(true);
            await configService.finishSetup();
            setIsLoading(false);
            window.location.reload();
          }}
          mb={70}
          mt="lg"
        >
          Let me in!
        </Button>
      </Stack>
    </>
  );
};

export default Setup;
