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
  // updateConfigVariable: any;
  updateConfigVariable: (variable: UpdateConfig) => void;
}) => {
  const form = useForm({
    initialValues: {
      stringValue:
        configVariable.editedValue === ""
          ? configVariable.value
          : configVariable.editedValue,
      textValue:
        configVariable.editedValue === ""
          ? configVariable.value
          : configVariable.editedValue,
      numberValue: parseInt(
        configVariable.editedValue === ""
          ? configVariable.value
          : configVariable.editedValue
      ),
      booleanValue:
        (configVariable.editedValue === ""
          ? configVariable.value
          : configVariable.editedValue) == "true",
    },
  });

  // {
  //   console.log(JSON.stringify(configVariable));
  // }

  const onValueChange = (configVariable: AdminConfig, value: any) => {
    form.setFieldValue(`${configVariable.type}Value`, value);
    updateConfigVariable({ key: configVariable.key, editedValue: value });

    // updateConfigVariable((prev: any) => {
    //   return { ...prev, key: configVariable.key, editedValue: value };
    // });
  };

  return (
    <Stack align="end">
      {configVariable.type == "string" &&
        (configVariable.obscured ? (
          <PasswordInput
            style={{ width: "100%" }}
            {...form.getInputProps("stringValue")}
            onChange={(e) => onValueChange(configVariable, e.target.value)}
          />
        ) : (
          <TextInput
            style={{ width: "100%" }}
            {...form.getInputProps("stringValue")}
            placeholder={configVariable.value}
            onChange={(e) => onValueChange(configVariable, e.target.value)}
          />
        ))}

      {configVariable.type == "text" && (
        <Textarea
          style={{ width: "100%" }}
          autosize
          {...form.getInputProps("textValue")}
          placeholder={configVariable.value}
          onChange={(e) => onValueChange(configVariable, e.target.value)}
        />
      )}
      {configVariable.type == "number" && (
        <NumberInput
          {...form.getInputProps("numberValue")}
          placeholder={configVariable.value}
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
