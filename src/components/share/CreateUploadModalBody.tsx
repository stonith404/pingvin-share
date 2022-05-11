import {
  Accordion,
  Button,
  Col,
  Grid,
  Group,
  MultiSelect,
  NumberInput,
  PasswordInput,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useModals } from "@mantine/modals";
import * as yup from "yup";
import shareService from "../../services/share.service";
import toast from "../../utils/toast.util";

const CreateUploadModalBody = ({
  mode,
  uploadCallback,
}: {
  mode: "standard" | "email";
  uploadCallback: (
    id: string,
    expiration: number,
    security: { password?: string; maxVisitors?: number },
    emails?: string[]
  ) => void;
}) => {
  const modals = useModals();
  const validationSchema = yup.object().shape({
    link: yup.string().required().min(2).max(50),
    emails:
      mode == "email"
        ? yup.array().of(yup.string().email()).min(1)
        : yup.array(),
    password: yup.string().min(3).max(100),
    maxVisitors: yup.number().min(1),
  });
  const form = useForm({
    initialValues: {
      link: "",
      emails: [] as string[],
      password: undefined,
      maxVisitors: undefined,
      expiration: "1440",
    },
    schema: yupResolver(validationSchema),
  });

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        if (await shareService.isIdAlreadyInUse(values.link)) {
          form.setFieldError("link", "Link already in use.");
        } else {
          modals.closeAll();
          uploadCallback(
            values.link,
            parseInt(values.expiration),
            {
              password: values.password,
              maxVisitors: values.maxVisitors,
            },
            values.emails
          );
        }
      })}
    >
      <Group direction="column" grow>
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
        {mode == "email" && (
          <MultiSelect
            label="Email adresses"
            data={form.values.emails}
            placeholder="Email adresses"
            searchable
            creatable
            rightSection={<></>}
            getCreateLabel={(email) => `${email}`}
            onCreate={async (email) => {
              if (!(await shareService.doesUserExist(email))) {
                form.setFieldValue("emails", form.values.emails);
                toast.error(
                  `${email} doesn't have an account at Pingvin Share.`
                );
              }
            }}
            {...form.getInputProps("emails")}
          />
        )}
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
          <Accordion.Item
            label="Security options"
            sx={{ borderBottom: "none" }}
          >
            <Group direction="column" grow>
              {mode == "standard" && (
                <PasswordInput
                  variant="filled"
                  placeholder="No password"
                  label="Password protection"
                  {...form.getInputProps("password")}
                />
              )}
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

export default CreateUploadModalBody;
