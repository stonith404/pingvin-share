import {
  Accordion,
  Button,
  Col,
  Grid,
  NumberInput,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useModals } from "@mantine/modals";
import * as yup from "yup";
import shareService from "../../services/share.service";
import { ShareSecurity } from "../../types/share.type";

const CreateUploadModalBody = ({
  uploadCallback,
}: {
  uploadCallback: (
    id: string,
    expiration: string,
    security: ShareSecurity
  ) => void;
}) => {
  const modals = useModals();
  const validationSchema = yup.object().shape({
    link: yup
      .string()
      .required()
      .min(3)
      .max(100)
      .matches(new RegExp("^[a-zA-Z0-9_-]*$"), {
        message: "Can only contain letters, numbers, underscores and hyphens",
      }),
    password: yup.string().min(3).max(30),
    maxViews: yup.number().min(1),
  });
  const form = useForm({
    initialValues: {
      link: "",

      password: undefined,
      maxViews: undefined,
      expiration: "1-day",
    },
    validate: yupResolver(validationSchema),
  });

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        if (!(await shareService.isShareIdAvailable(values.link))) {
          form.setFieldError("link", "This link is already in use");
        } else {
          uploadCallback(values.link, values.expiration, {
            password: values.password,
            maxViews: values.maxViews,
          });
          modals.closeAll();
        }
      })}
    >
      <Stack align="stretch">
        <Grid align={form.errors.link ? "center" : "flex-end"}>
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
            {
              value: "10-minutes",
              label: "10 Minutes",
            },
            { value: "1-hour", label: "1 Hour" },
            { value: "1-day", label: "1 Day" },
            { value: "1-week".toString(), label: "1 Week" },
            { value: "1-month", label: "1 Month" },
          ]}
        />
        <Accordion>
          <Accordion.Item value="security" sx={{ borderBottom: "none" }}>
            <Accordion.Control>Security options</Accordion.Control>
            <Accordion.Panel>
              <Stack align="stretch">
                <PasswordInput
                  variant="filled"
                  placeholder="No password"
                  label="Password protection"
                  {...form.getInputProps("password")}
                />
                <NumberInput
                  min={1}
                  type="number"
                  variant="filled"
                  placeholder="No limit"
                  label="Maximal views"
                  {...form.getInputProps("maxViews")}
                />
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
        <Button type="submit">Share</Button>
      </Stack>
    </form>
  );
};

export default CreateUploadModalBody;
