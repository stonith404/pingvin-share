import {
  Accordion,
  Alert,
  Button,
  Checkbox,
  Col,
  Grid,
  MultiSelect,
  NumberInput,
  PasswordInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { useEffect, useState } from "react";
import { TbAlertCircle } from "react-icons/tb";
import * as yup from "yup";
import shareService from "../../../services/share.service";
import { CreateShare, ReverseShareOptions } from "../../../types/share.type";
import { getExpirationPreview } from "../../../utils/date.util";

const showCreateUploadModal = (
  modals: ModalsContextProps,
  options: {
    isUserSignedIn: boolean;
    isReverseShare: boolean;
    shareOptions: ReverseShareOptions;
    appUrl: string;
    allowUnauthenticatedShares: boolean;
    enableEmailRecepients: boolean;
  },
  uploadCallback: (createShare: CreateShare) => void
) => {
  return modals.openModal({
    title: "Share",
    children: (
      <CreateUploadModalBody
        options={options}
        uploadCallback={uploadCallback}
      />
    ),
  });
};

const CreateUploadModalBody = ({
  uploadCallback,
  options,
}: {
  uploadCallback: (createShare: CreateShare) => void;
  options: {
    isUserSignedIn: boolean;
    isReverseShare: boolean;
    appUrl: string;
    shareOptions: ReverseShareOptions;
    allowUnauthenticatedShares: boolean;
    enableEmailRecepients: boolean;
  };
}) => {
  const modals = useModals();

  const generatedLink = Buffer.from(Math.random().toString(), "utf8")
    .toString("base64")
    .substr(10, 7);

  const [showNotSignedInAlert, setShowNotSignedInAlert] = useState(true);

  let showModal = true;
  if (options.isReverseShare) {
    if (options.shareOptions.easyMode) showModal = false;
    if (
      !options.shareOptions.maximalViewsEnabled &&
      !options.shareOptions.passwordEnabled &&
      !options.shareOptions.descriptionEnabled &&
      !options.shareOptions.customLinkEnabled
    )
      showModal = false;
  }

  const validationSchema = yup.object().shape({
    link: yup
      .string()
      .required()
      .min(3)
      .max(50)
      .matches(new RegExp("^[a-zA-Z0-9_-]*$"), {
        message: "Can only contain letters, numbers, underscores and hyphens",
      }),
    password: yup.string().min(3).max(30),
    maxViews: yup.number().min(1),
  });
  const form = useForm({
    initialValues: {
      link: generatedLink,
      recipients: [] as string[],
      password: undefined,
      maxViews: undefined,
      description: undefined,
      expiration_num: 1,
      expiration_unit: "-days",
      never_expires: false,
    },
    validate: yupResolver(validationSchema),
  });

  const onSubmit = form.onSubmit(async (values) => {
    if (!(await shareService.isShareIdAvailable(values.link))) {
      form.setFieldError("link", "This link is already in use");
    } else {
      const expiration = form.values.never_expires
        ? "never"
        : form.values.expiration_num + form.values.expiration_unit;
      uploadCallback({
        id: values.link,
        expiration: expiration,
        recipients: values.recipients,
        description: values.description,
        security: {
          password: values.password,
          maxViews: values.maxViews,
        },
      });
      modals.closeAll();
    }
  });

  useEffect(() => {
    if (!showModal) onSubmit();
  }, []);

  return (
    <>
      {showNotSignedInAlert && !options.isUserSignedIn && (
        <Alert
          withCloseButton
          onClose={() => setShowNotSignedInAlert(false)}
          icon={<TbAlertCircle size={16} />}
          title="You're not signed in"
          color="yellow"
        >
          You will be unable to delete your share manually and view the visitor
          count.
        </Alert>
      )}

      <form
        onSubmit={() => {
          onSubmit();
        }}
        style={{ display: showModal ? "initial" : "none" }}
      >
        <Stack align="stretch">
          <div
            style={{
              display:
                !options.isReverseShare ||
                options.shareOptions.customLinkEnabled
                  ? "initial"
                  : "none",
            }}
          >
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
              italic
              size="xs"
              sx={(theme) => ({
                color: theme.colors.gray[6],
              })}
            >
              {options.appUrl}/share/
              {form.values.link == "" ? "myAwesomeShare" : form.values.link}
            </Text>
          </div>

          {!options.isReverseShare && (
            <>
              <Grid align={form.errors.link ? "center" : "flex-end"}>
                <Col xs={6}>
                  <NumberInput
                    min={1}
                    max={99999}
                    precision={0}
                    variant="filled"
                    label="Expiration"
                    placeholder="n"
                    disabled={form.values.never_expires}
                    {...form.getInputProps("expiration_num")}
                  />
                </Col>
                <Col xs={6}>
                  <Select
                    disabled={form.values.never_expires}
                    {...form.getInputProps("expiration_unit")}
                    data={[
                      // Set the label to singular if the number is 1, else plural
                      {
                        value: "-minutes",
                        label:
                          "Minute" +
                          (form.values.expiration_num == 1 ? "" : "s"),
                      },
                      {
                        value: "-hours",
                        label:
                          "Hour" + (form.values.expiration_num == 1 ? "" : "s"),
                      },
                      {
                        value: "-days",
                        label:
                          "Day" + (form.values.expiration_num == 1 ? "" : "s"),
                      },
                      {
                        value: "-weeks",
                        label:
                          "Week" + (form.values.expiration_num == 1 ? "" : "s"),
                      },
                      {
                        value: "-months",
                        label:
                          "Month" +
                          (form.values.expiration_num == 1 ? "" : "s"),
                      },
                      {
                        value: "-years",
                        label:
                          "Year" + (form.values.expiration_num == 1 ? "" : "s"),
                      },
                    ]}
                  />
                </Col>
              </Grid>
              <Checkbox
                label="Never Expires"
                {...form.getInputProps("never_expires")}
              />
              <Text
                italic
                size="xs"
                sx={(theme) => ({
                  color: theme.colors.gray[6],
                })}
              >
                {getExpirationPreview("share", form)}
              </Text>
            </>
          )}

          <Accordion>
            <Accordion.Item
              value="description"
              sx={{
                borderBottom: "none",
                display:
                  !options.isReverseShare ||
                  options.shareOptions.descriptionEnabled
                    ? "initial"
                    : "none",
              }}
            >
              <Accordion.Control>Description</Accordion.Control>
              <Accordion.Panel>
                <Stack align="stretch">
                  <Textarea
                    variant="filled"
                    placeholder="Note for the recepients"
                    {...form.getInputProps("description")}
                  />
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>

            {options.enableEmailRecepients && !options.isReverseShare && (
              <Accordion.Item value="recipients" sx={{ borderBottom: "none" }}>
                <Accordion.Control>Email recipients</Accordion.Control>
                <Accordion.Panel>
                  <MultiSelect
                    data={form.values.recipients}
                    placeholder="Enter email recipients"
                    searchable
                    {...form.getInputProps("recipients")}
                    creatable
                    getCreateLabel={(query) => `+ ${query}`}
                    onCreate={(query) => {
                      if (!query.match(/^\S+@\S+\.\S+$/)) {
                        form.setFieldError(
                          "recipients",
                          "Invalid email address"
                        );
                      } else {
                        form.setFieldError("recipients", null);
                        form.setFieldValue("recipients", [
                          ...form.values.recipients,
                          query,
                        ]);
                        return query;
                      }
                    }}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            )}
            <Accordion.Item
              value="security"
              sx={{
                borderBottom: "none",
                display:
                  !options.isReverseShare ||
                  options.shareOptions.passwordEnabled ||
                  options.shareOptions.maximalViewsEnabled
                    ? "initial"
                    : "none",
              }}
            >
              <Accordion.Control>Security options</Accordion.Control>
              <Accordion.Panel>
                <Stack align="stretch">
                  <PasswordInput
                    sx={{
                      display:
                        !options.isReverseShare ||
                        options.shareOptions.passwordEnabled
                          ? "initial"
                          : "none",
                    }}
                    variant="filled"
                    placeholder="No password"
                    label="Password protection"
                    {...form.getInputProps("password")}
                  />

                  <NumberInput
                    sx={{
                      display:
                        !options.isReverseShare ||
                        options.shareOptions.maximalViewsEnabled
                          ? "initial"
                          : "none",
                    }}
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
    </>
  );
};

export default showCreateUploadModal;
