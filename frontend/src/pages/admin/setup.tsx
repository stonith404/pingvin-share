import { Box, Stack, Text, Title } from "@mantine/core";
import AdminConfigTable from "../../components/admin/configuration/AdminConfigTable";

import Logo from "../../components/Logo";
import Meta from "../../components/Meta";

const Setup = () => {
  return (
    <>
      <Meta title="Setup" />
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
