import {
  Box,
  Button,
  Group,
  Paper,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState } from "react";
import useConfig from "../../../hooks/config.hook";
import configService from "../../../services/config.service";
import {
  AdminConfigGroupedByCategory,
  UpdateConfig,
} from "../../../types/config.type";
import {
  capitalizeFirstLetter,
  configVariableToFriendlyName,
} from "../../../utils/string.util";
import toast from "../../../utils/toast.util";

import AdminConfigInput from "./AdminConfigInput";
import TestEmailButton from "./TestEmailButton";

const AdminConfigTable = () => {
  const config = useConfig();
  const isMobile = useMediaQuery("(max-width: 560px)");

  let updatedConfigVariables: UpdateConfig[] = [];

  const updateConfigVariable = (configVariable: UpdateConfig) => {
    const index = updatedConfigVariables.findIndex(
      (item) => item.key === configVariable.key
    );
    if (index > -1) {
      updatedConfigVariables[index] = configVariable;
    } else {
      updatedConfigVariables.push(configVariable);
    }
  };

  const [configVariablesByCategory, setCofigVariablesByCategory] =
    useState<AdminConfigGroupedByCategory>({});

  const getConfigVariables = async () => {
    await configService.listForAdmin().then((configVariables) => {
      const configVariablesByCategory = configVariables.reduce(
        (categories: any, item) => {
          const category = categories[item.category] || [];
          category.push(item);
          categories[item.category] = category;
          return categories;
        },
        {}
      );
      setCofigVariablesByCategory(configVariablesByCategory);
    });
  };

  useEffect(() => {
    getConfigVariables();
  }, []);

  return (
    <Box mb="lg">
      {Object.entries(configVariablesByCategory).map(
        ([category, configVariables]) => {
          return (
            <Paper key={category} withBorder p="lg" mb="xl">
              <Title mb="xs" order={3}>
                {capitalizeFirstLetter(category)}
              </Title>
              {configVariables.map((configVariable) => (
                <>
                  <Group position="apart">
                    <Stack
                      style={{ maxWidth: isMobile ? "100%" : "40%" }}
                      spacing={0}
                    >
                      <Title order={6}>
                        {configVariableToFriendlyName(configVariable.key)}
                      </Title>
                      <Text color="dimmed" size="sm" mb="xs">
                        {configVariable.description}
                      </Text>
                    </Stack>
                    <Stack></Stack>
                    <Box style={{ width: isMobile ? "100%" : "50%" }}>
                      <AdminConfigInput
                        key={configVariable.key}
                        updateConfigVariable={updateConfigVariable}
                        configVariable={configVariable}
                      />
                    </Box>
                  </Group>

                  <Space h="lg" />
                </>
              ))}
              {category == "email" && (
                <Group position="right">
                  <TestEmailButton />
                </Group>
              )}
            </Paper>
          );
        }
      )}
      <Group position="right">
        <Button
          onClick={() => {
            if (config.get("SETUP_FINISHED")) {
              configService
                .updateMany(updatedConfigVariables)
                .then(() =>
                  toast.success("Configurations updated successfully")
                )
                .catch(toast.axiosError);
            } else {
              configService
                .updateMany(updatedConfigVariables)
                .then(async () => {
                  await configService.finishSetup();
                  window.location.reload();
                })
                .catch(toast.axiosError);
            }
          }}
        >
          Save
        </Button>
      </Group>
    </Box>
  );
};

export default AdminConfigTable;
