import { ActionIcon, Code, Group, Skeleton, Table, Text } from "@mantine/core";
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

  const getConfigVariables = () => {
    setIsLoading(true);
    configService.listForAdmin().then((configVariables) => {
      setConfigVariables(configVariables);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getConfigVariables();
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
          : configVariables.map((element) => (
              <tr key={element.key}>
                <td style={{ maxWidth: "200px" }}>
                  <Code>{element.key}</Code> {element.secret && <TbLock />}{" "}
                  <br />
                  <Text size="xs" color="dimmed">
                    {" "}
                    {element.description}
                  </Text>
                </td>
                <td>{element.value}</td>

                <td>
                  <Group position="right">
                    <ActionIcon
                      color="primary"
                      variant="light"
                      size={25}
                      onClick={() =>
                        showUpdateConfigVariableModal(
                          modals,
                          element,
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
  );
};

export default AdminConfigTable;
