import {
  NumberInput,
  PasswordInput,
  Stack,
  Switch,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { AdminConfig, UpdateConfig } from "../../../types/config.type";

const AdminConfigInput = ({
  configVariable,
  updateConfigVariable,
}: {
  configVariable: AdminConfig;
  updateConfigVariable: (variable: UpdateConfig) => void;
}) => {
  const form = useForm({
    initialValues: {
      stringValue:
        configVariable.value === ""
          ? configVariable.defaultValue
          : configVariable.value,
      textValue:
        configVariable.value === ""
          ? configVariable.defaultValue
          : configVariable.value,
      numberValue: parseInt(
        configVariable.value === ""
          ? configVariable.defaultValue
          : configVariable.value
      ),
      booleanValue:
        (configVariable.value === ""
          ? configVariable.defaultValue
          : configVariable.value) == "true",
    },
  });

  const onValueChange = (configVariable: AdminConfig, value: any) => {
    form.setFieldValue(`${configVariable.type}Value`, value);
    updateConfigVariable({ key: configVariable.key, value: value });
  };

  return (
    <Stack align="end">
      {configVariable.type == "string" &&
        (configVariable.obscured ? (
          <PasswordInput
            style={{
              width: "100%",
            }}
            {...form.getInputProps("stringValue")}
            onChange={(e) => onValueChange(configVariable, e.target.value)}
          />
        ) : (
          <TextInput
            style={{
              width: "100%",
            }}
            {...form.getInputProps("stringValue")}
            placeholder={configVariable.defaultValue}
            onChange={(e) => onValueChange(configVariable, e.target.value)}
          />
        ))}

      {configVariable.type == "text" && (
        <Textarea
          style={{
            width: "100%",
          }}
          autosize
          {...form.getInputProps("textValue")}
          placeholder={configVariable.defaultValue}
          onChange={(e) => onValueChange(configVariable, e.target.value)}
        />
      )}
      {configVariable.type == "number" && (
        <NumberInput
          {...form.getInputProps("numberValue")}
          placeholder={configVariable.defaultValue}
          onChange={(number) => onValueChange(configVariable, number)}
        />
      )}
      {configVariable.type == "boolean" && (
        <>
          <Switch
            {...form.getInputProps("booleanValue", { type: "checkbox" })}
            onChange={(e) => onValueChange(configVariable, e.target.checked)}
          />
        </>
      )}
    </Stack>
  );
};

export default AdminConfigInput;
