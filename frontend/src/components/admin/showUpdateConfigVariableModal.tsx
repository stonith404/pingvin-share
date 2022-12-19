import {
  Button,
  Code,
  NumberInput,
  PasswordInput,
  Select,
  Space,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import configService from "../../services/config.service";
import { AdminConfig } from "../../types/config.type";
import toast from "../../utils/toast.util";

const showUpdateConfigVariableModal = (
  modals: ModalsContextProps,
  configVariable: AdminConfig,
  getConfigVariables: () => void
) => {
  return modals.openModal({
    title: <Title order={5}>Update configuration variable</Title>,
    children: (
      <Body
        configVariable={configVariable}
        getConfigVariables={getConfigVariables}
      />
    ),
  });
};

const Body = ({
  configVariable,
  getConfigVariables,
}: {
  configVariable: AdminConfig;
  getConfigVariables: () => void;
}) => {
  const modals = useModals();

  const form = useForm({
    initialValues: {
      stringValue: configVariable.value,
      textValue: configVariable.value,
      numberValue: parseInt(configVariable.value),
      booleanValue: configVariable.value,
    },
  });
  return (
    <Stack align="stretch">
      <Text>
        Set <Code>{configVariable.key}</Code> to
      </Text>
      {configVariable.type == "string" &&
        (configVariable.obscured ? (
          <PasswordInput {...form.getInputProps("stringValue")} />
        ) : (
          <TextInput {...form.getInputProps("stringValue")} />
        ))}

      {configVariable.type == "text" && (
        <Textarea autosize {...form.getInputProps("textValue")} />
      )}
      {configVariable.type == "number" && (
        <NumberInput {...form.getInputProps("numberValue")} />
      )}
      {configVariable.type == "boolean" && (
        <Select
          data={[
            { value: "true", label: "True" },
            { value: "false", label: "False" },
          ]}
          {...form.getInputProps("booleanValue")}
        />
      )}
      <Space />
      <Button
        onClick={async () => {
          const value =
            configVariable.type == "string"
              ? form.values.stringValue
              : configVariable.type == "text"
              ? form.values.textValue
              : configVariable.type == "number"
              ? form.values.numberValue
              : form.values.booleanValue == "true";

          await configService
            .update(configVariable.key, value)
            .then(() => {
              getConfigVariables();
              modals.closeAll();
            })
            .catch(toast.axiosError);
        }}
      >
        Save
      </Button>
    </Stack>
  );
};

export default showUpdateConfigVariableModal;
