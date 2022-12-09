import {
  ActionIcon,
  Box,
  Code,
  Group,
  Skeleton,
  Table,
  Text,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { TbEdit, TbLock } from "react-icons/tb";
import configService from "../../services/config.service";
import { AdminConfig as AdminConfigType } from "../../types/config.type";
import showUpdateConfigVariableModal from "./showUpdateConfigVariableModal";

const AdminConfigTable = () => {
  const modals = useModals();

  const [isLoading, setIsLoading] = useState(false);

  const [configVariables, setConfigVariables] = useState<AdminConfigType[]>([]);

  const getConfigVariables = async () => {
    await configService.listForAdmin().then((configVariables) => {
      setConfigVariables(configVariables);
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
    <Box sx={{ display: "block", overflowX: "auto" }}>
      <Table verticalSpacing="sm" horizontalSpacing="xl" withBorder>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? skeletonRows
            : configVariables.map((configVariable) => (
                <tr key={configVariable.key}>
                  <td style={{ maxWidth: "200px" }}>
                    <Code>{configVariable.key}</Code>{" "}
                    {configVariable.secret && <TbLock />} <br />
                    <Text size="xs" color="dimmed">
                      {configVariable.description}
                    </Text>
                  </td>
                  <td>
                    {configVariable.obscured
                      ? "•".repeat(configVariable.value.length)
                      : configVariable.value}
                  </td>
                  <td>
                    <Group position="right">
                      <ActionIcon
                        color="primary"
                        variant="light"
                        size={25}
                        onClick={() =>
                          showUpdateConfigVariableModal(
                            modals,
                            configVariable,
                            getConfigVariables
                          )
                        }
                      >
                        <TbEdit />
                      </ActionIcon>
                    </Group>
                  </td>
                </tr>
              ))}
        </tbody>
      </Table>
    </Box>
  );
};

export default AdminConfigTable;
