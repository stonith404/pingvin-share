import {
  AppShell,
  Box,
  Button,
  Container,
  Group,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AdminConfigInput from "../../../components/admin/configuration/AdminConfigInput";
import ConfigurationHeader from "../../../components/admin/configuration/ConfigurationHeader";
import ConfigurationNavBar from "../../../components/admin/configuration/ConfigurationNavBar";
import CenterLoader from "../../../components/core/CenterLoader";
import Meta from "../../../components/Meta";
import useConfig from "../../../hooks/config.hook";
import configService from "../../../services/config.service";
import { AdminConfig, UpdateConfig } from "../../../types/config.type";
import {
  capitalizeFirstLetter,
  configVariableToFriendlyName,
} from "../../../utils/string.util";
import toast from "../../../utils/toast.util";

export default function AppShellDemo() {
  const theme = useMantineTheme();
  const router = useRouter();

  const [isMobileNavBarOpened, setIsMobileNavBarOpened] = useState(false);
  const isMobile = useMediaQuery("(max-width: 560px)");
  const config = useConfig();

  const categoryId = router.query.category as string;

  const [configVariables, setConfigVariables] = useState<AdminConfig[]>([]);
  const [updatedConfigVariables, setUpdatedConfigVariables] = useState<
    UpdateConfig[]
  >([]);

  const saveConfigVariables = async () => {
    await configService
      .updateMany(updatedConfigVariables)
      .then(() => {
        setUpdatedConfigVariables([]);
        toast.success("Configurations updated successfully");
      })
      .catch(toast.axiosError);
    config.refresh();
  };

  const updateConfigVariable = (configVariable: UpdateConfig) => {
    const index = updatedConfigVariables.findIndex(
      (item) => item.key === configVariable.key
    );
    if (index > -1) {
      updatedConfigVariables[index] = configVariable;
    } else {
      setUpdatedConfigVariables([...updatedConfigVariables, configVariable]);
    }
  };

  useEffect(() => {
    configService.getByCategory(categoryId).then((configVariables) => {
      setConfigVariables(configVariables);
    });
  }, [categoryId]);

  return (
    <>
      <Meta title="Configuration" />
      <AppShell
        styles={{
          main: {
            background:
              theme.colorScheme === "dark"
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        }}
        navbarOffsetBreakpoint="sm"
        navbar={
          <ConfigurationNavBar
            categoryId={categoryId}
            isMobileNavBarOpened={isMobileNavBarOpened}
            setIsMobileNavBarOpened={setIsMobileNavBarOpened}
          />
        }
        header={
          <ConfigurationHeader
            isMobileNavBarOpened={isMobileNavBarOpened}
            setIsMobileNavBarOpened={setIsMobileNavBarOpened}
          />
        }
      >
        <Container size="lg">
          {!configVariables ? (
            <CenterLoader />
          ) : (
            <>
              <Stack>
                <Title mb="md" order={3}>
                  {capitalizeFirstLetter(categoryId)}
                </Title>
                {configVariables.map((configVariable) => (
                  <Group key={configVariable.key} position="apart">
                    <Stack
                      style={{ maxWidth: isMobile ? "100%" : "40%" }}
                      spacing={0}
                    >
                      <Title order={6}>
                        {configVariableToFriendlyName(configVariable.name)}
                      </Title>
                      <Text color="dimmed" size="sm" mb="xs">
                        {configVariable.description}
                      </Text>
                    </Stack>
                    <Stack></Stack>
                    <Box style={{ width: isMobile ? "100%" : "50%" }}>
                      <AdminConfigInput
                        key={configVariable.key}
                        configVariable={configVariable}
                        updateConfigVariable={updateConfigVariable}
                      />
                    </Box>
                  </Group>
                ))}
              </Stack>
              <Group position="right">
                <Button mt="lg" onClick={saveConfigVariables}>
                  Save
                </Button>
              </Group>
            </>
          )}
        </Container>
      </AppShell>
    </>
  );
}
