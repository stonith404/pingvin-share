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
import { stringToTimespan, timespanToString } from "../../../utils/date.util";
import FileSizeInput from "../../core/FileSizeInput";
import TimespanInput from "../../core/TimespanInput";

const AdminConfigInput = ({
  configVariable,
  updateConfigVariable,
}: {
  configVariable: AdminConfig;
  updateConfigVariable: (variable: UpdateConfig) => void;
}) => {
  const form = useForm({
    initialValues: {
      stringValue: configVariable.value ?? configVariable.defaultValue,
      textValue: configVariable.value ?? configVariable.defaultValue,
      numberValue: parseInt(
        configVariable.value ?? configVariable.defaultValue,
      ),
      booleanValue:
        (configVariable.value ?? configVariable.defaultValue) == "true",
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
            autoComplete="new-password"
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
          w={201}
        />
      )}
      {configVariable.type == "filesize" && (
        <FileSizeInput
          {...form.getInputProps("numberValue")}
          value={parseInt(configVariable.value ?? configVariable.defaultValue)}
          onChange={(bytes) => onValueChange(configVariable, bytes)}
          w={201}
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
      {configVariable.type == "timespan" && (
        <TimespanInput
          value={stringToTimespan(configVariable.value)}
          onChange={(timespan) =>
            onValueChange(configVariable, timespanToString(timespan))
          }
          w={201}
        />
      )}
    </Stack>
  );
};

export default AdminConfigInput;
