import {
  Box,
  Group,
  Paper,
  Skeleton,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useEffect, useState } from "react";
import configService from "../../services/config.service";
import {
  AdminConfigGroupedByCategory,
  UpdateConfig,
} from "../../types/config.type";
import {
  capitalizeFirstLetter,
  configVariableToFriendlyName,
} from "../../utils/string.util";
import AdminConfigInput from "./AdminConfigInput";

const AdminConfigTable = () => {
  const modals = useModals();

  const [isLoading, setIsLoading] = useState(false);

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
    console.log(updatedConfigVariables);
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
    setIsLoading(true);
    getConfigVariables().then(() => setIsLoading(false));
  }, []);

  const skeletonRows = [...Array(9)].map((c, i) => (
    <tr key={i}>
      <td>
        <Skeleton height={18} width={80} mb="sm" />
        <Skeleton height={30} />
      </td>
      <td>
        <Skeleton height={18} />
      </td>

      <td>
        <Group position="right">
          <Skeleton height={25} width={25} />
        </Group>
      </td>
    </tr>
  ));

  return (
    <Box>
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
                    <Stack style={{ maxWidth: "40%" }} spacing={0}>
                      <Title order={6}>
                        {configVariableToFriendlyName(configVariable.key)}
                      </Title>
                      <Text color="dimmed" size="sm" mb="xs">
                        {configVariable.description}
                      </Text>
                    </Stack>
                    <Stack></Stack>
                    <Box style={{ width: "50%" }}>
                      <AdminConfigInput
                        key={configVariable.key}
                        updateConfigVariable={updateConfigVariable}
                        configVariable={configVariable}
                      />{" "}
                    </Box>
                  </Group>

                  <Space h="lg" />
                </>
              ))}
            </Paper>
          );
        }
      )}
    </Box>
  );
};

export default AdminConfigTable;
