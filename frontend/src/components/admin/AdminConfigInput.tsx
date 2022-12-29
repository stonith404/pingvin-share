import {
  NumberInput,
  PasswordInput,
  Stack,
  Switch,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { AdminConfig, UpdateConfig } from "../../types/config.type";

const AdminConfigInput = ({
  configVariable,
  updateConfigVariable,
}: {
  configVariable: AdminConfig;
  updateConfigVariable: (variable: UpdateConfig) => void;
}) => {
  const form = useForm({
    initialValues: {
      stringValue: configVariable.value,
      textValue: configVariable.value,
      numberValue: parseInt(configVariable.value),
      booleanValue: configVariable.value,
    },
  });

  const onValueChange = (configVariable: AdminConfig, value: any) => {
    form.setFieldValue(`${configVariable.type}Value`, value);
    updateConfigVariable({ key: configVariable.key, value: value.toString() });
  };

  return (
    <Stack align="end">
      {configVariable.type == "string" &&
        (configVariable.obscured ? (
          <PasswordInput
            style={{ width: "100%" }}
            onChange={(e) => onValueChange(configVariable, e.target.value)}
            {...form.getInputProps("stringValue")}
          />
        ) : (
          <TextInput
            style={{ width: "100%" }}
            {...form.getInputProps("stringValue")}
            onChange={(e) => onValueChange(configVariable, e.target.value)}
          />
        ))}

      {configVariable.type == "text" && (
        <Textarea
          style={{ width: "100%" }}
          autosize
          {...form.getInputProps("textValue")}
          onChange={(e) => onValueChange(configVariable, e.target.value)}
        />
      )}
      {configVariable.type == "number" && (
        <NumberInput
          {...form.getInputProps("numberValue")}
          onChange={(number) => onValueChange(configVariable, number)}
        />
      )}
      {configVariable.type == "boolean" && (
        <Switch
          {...form.getInputProps("booleanValue")}
          onChange={(e) => onValueChange(configVariable, e.target.checked)}
        />
      )}
    </Stack>
  );
};

export default AdminConfigInput;
