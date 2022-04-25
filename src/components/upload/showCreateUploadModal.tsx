import {
  Accordion,
  Button,
  Col,
  Grid,
  Group,
  NumberInput,
  PasswordInput,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import * as yup from "yup";

const showCreateUploadModal = (
  modals: ModalsContextProps,
  uploadCallback: (
    id: string,
    expiration: number,
    security: { password?: string; maxVisitors?: number }
  ) => void
) => {
  return modals.openModal({
    title: <Title order={4}>Share</Title>,
    children: <Body uploadCallback={uploadCallback} />,
  });
};

const Body = ({
  uploadCallback,
}: {
  uploadCallback: (
    id: string,
    expiration: number,
    security: { password?: string; maxVisitors?: number }
  ) => void;
}) => {
  const modals = useModals();
  const validationSchema = yup.object().shape({
    link: yup.string().required().min(2).max(50),
    password: yup.string().min(3).max(100),
    maxVisitors: yup.number().min(1),
  });
  const form = useForm({
    initialValues: {
      link: "",
      password: undefined,
      maxVisitors: undefined,
      expiration: "1440",
    },
    schema: yupResolver(validationSchema),
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        modals.closeAll();
        uploadCallback(values.link, parseInt(values.expiration), {
          password: values.password,
          maxVisitors: values.maxVisitors,
        });
      })}
    >
      <Group direction="column" grow>
        <Grid align="flex-end">
          <Col xs={9}>
            <TextInput
              variant="filled"
              label="Link"
              placeholder="myAwesomeShare"
              {...form.getInputProps("link")}
            />
          </Col>
          <Col xs={3}>
            <Button
              variant="outline"
              onClick={() =>
                form.setFieldValue(
                  "link",
                  Buffer.from(Math.random().toString(), "utf8")
                    .toString("base64")
                    .substr(10, 7)
                )
              }
            >
              Generate
            </Button>
          </Col>
        </Grid>

        <Text
          size="xs"
          sx={(theme) => ({
            color: theme.colors.gray[6],
          })}
        >
          {window.location.origin}/share/
          {form.values.link == "" ? "myAwesomeShare" : form.values.link}
        </Text>
        <Select
          label="Expiration"
          {...form.getInputProps("expiration")}
          data={[
            { value: "10", label: "10 Minutes" },
            { value: "60", label: "1 Hour" },
            { value: "1440", label: "1 Day" },
            { value: "1080", label: "1 Week" },
            { value: "43000", label: "1 Month" },
          ]}
        />
        <Accordion>
          <Accordion.Item label="Security" sx={{ borderBottom: "none" }}>
            <Group direction="column" grow>
              <PasswordInput
                variant="filled"
                placeholder="No password"
                label="Password protection"
                {...form.getInputProps("password")}
              />
              <NumberInput
                type="number"
                variant="filled"
                placeholder="No limit"
                label="Maximal views"
                {...form.getInputProps("maxVisitors")}
              />
            </Group>
          </Accordion.Item>
        </Accordion>
        <Button type="submit">Share</Button>
      </Group>
    </form>
  );
};

export default showCreateUploadModal;
