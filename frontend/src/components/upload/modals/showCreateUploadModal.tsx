import {
  Accordion,
  Alert,
  Button,
  Checkbox,
  Col,
  Grid,
  Group,
  MultiSelect,
  NumberInput,
  PasswordInput,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import moment from "moment";
import { useState } from "react";
import { TbAlertCircle } from "react-icons/tb";
import { FormattedMessage } from "react-intl";
import * as yup from "yup";
import useTranslate, {
  translateOutsideContext,
} from "../../../hooks/useTranslate.hook";
import shareService from "../../../services/share.service";
import { FileUpload } from "../../../types/File.type";
import { CreateShare } from "../../../types/share.type";
import { getExpirationPreview } from "../../../utils/date.util";

const showCreateUploadModal = (
  modals: ModalsContextProps,
  options: {
    isUserSignedIn: boolean;
    isReverseShare: boolean;
    appUrl: string;
    allowUnauthenticatedShares: boolean;
    enableEmailRecepients: boolean;
    maxExpirationInHours: number;
  },
  files: FileUpload[],
  uploadCallback: (createShare: CreateShare, files: FileUpload[]) => void,
) => {
  const t = translateOutsideContext();

  return modals.openModal({
    title: t("upload.modal.title"),
    children: (
      <CreateUploadModalBody
        options={options}
        files={files}
        uploadCallback={uploadCallback}
      />
    ),
  });
};

const CreateUploadModalBody = ({
  uploadCallback,
  files,
  options,
}: {
  files: FileUpload[];
  uploadCallback: (createShare: CreateShare, files: FileUpload[]) => void;
  options: {
    isUserSignedIn: boolean;
    isReverseShare: boolean;
    appUrl: string;
    allowUnauthenticatedShares: boolean;
    enableEmailRecepients: boolean;
    maxExpirationInHours: number;
  };
}) => {
  const modals = useModals();
  const t = useTranslate();

  const generatedLink = Buffer.from(Math.random().toString(), "utf8")
    .toString("base64")
    .substr(10, 7);

  const [showNotSignedInAlert, setShowNotSignedInAlert] = useState(true);

  const validationSchema = yup.object().shape({
    link: yup
      .string()
      .required(t("common.error.field-required"))
      .min(3, t("common.error.too-short", { length: 3 }))
      .max(50, t("common.error.too-long", { length: 50 }))
      .matches(new RegExp("^[a-zA-Z0-9_-]*$"), {
        message: t("upload.modal.link.error.invalid"),
      }),
    password: yup
      .string()
      .transform((value) => value || undefined)
      .min(3)
      .max(30),
    maxViews: yup
      .number()
      .transform((value) => value || undefined)
      .min(1),
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
      form.setFieldError("link", t("upload.modal.link.error.taken"));
    } else {
      const expirationString = form.values.never_expires
        ? "never"
        : form.values.expiration_num + form.values.expiration_unit;

      const expirationDate = moment().add(
        form.values.expiration_num,
        form.values.expiration_unit.replace(
          "-",
          "",
        ) as moment.unitOfTime.DurationConstructor,
      );

      if (
        options.maxExpirationInHours != 0 &&
        (form.values.never_expires ||
          expirationDate.isAfter(
            moment().add(options.maxExpirationInHours, "hours"),
          ))
      ) {
        form.setFieldError(
          "expiration_num",
          t("upload.modal.expires.error.too-long", {
            max: moment
              .duration(options.maxExpirationInHours, "hours")
              .humanize(),
          }),
        );
        return;
      }

      uploadCallback(
        {
          id: values.link,
          expiration: expirationString,
          recipients: values.recipients,
          description: values.description,
          security: {
            password: values.password || undefined,
            maxViews: values.maxViews || undefined,
          },
        },
        files,
      );
      modals.closeAll();
    }
  });

  return (
    <>
      {showNotSignedInAlert && !options.isUserSignedIn && (
        <Alert
          withCloseButton
          onClose={() => setShowNotSignedInAlert(false)}
          icon={<TbAlertCircle size={16} />}
          title={t("upload.modal.not-signed-in")}
          color="yellow"
        >
          <FormattedMessage id="upload.modal.not-signed-in-description" />
        </Alert>
      )}
      <form onSubmit={onSubmit}>
        <Stack align="stretch">
          <Group align={form.errors.link ? "center" : "flex-end"}>
            <TextInput
              style={{ flex: "1" }}
              variant="filled"
              label={t("upload.modal.link.label")}
              placeholder="myAwesomeShare"
              {...form.getInputProps("link")}
            />
            <Button
              style={{ flex: "0 0 auto" }}
              variant="outline"
              onClick={() =>
                form.setFieldValue(
                  "link",
                  Buffer.from(Math.random().toString(), "utf8")
                    .toString("base64")
                    .substr(10, 7),
                )
              }
            >
              <FormattedMessage id="common.button.generate" />
            </Button>
          </Group>

          <Text
            italic
            size="xs"
            sx={(theme) => ({
              color: theme.colors.gray[6],
            })}
          >
            {`${options.appUrl}/s/${form.values.link}`}
          </Text>
          {!options.isReverseShare && (
            <>
              <Grid align={form.errors.expiration_num ? "center" : "flex-end"}>
                <Col xs={6}>
                  <NumberInput
                    min={1}
                    max={99999}
                    precision={0}
                    variant="filled"
                    label={t("upload.modal.expires.label")}
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
                          form.values.expiration_num == 1
                            ? t("upload.modal.expires.minute-singular")
                            : t("upload.modal.expires.minute-plural"),
                      },
                      {
                        value: "-hours",
                        label:
                          form.values.expiration_num == 1
                            ? t("upload.modal.expires.hour-singular")
                            : t("upload.modal.expires.hour-plural"),
                      },
                      {
                        value: "-days",
                        label:
                          form.values.expiration_num == 1
                            ? t("upload.modal.expires.day-singular")
                            : t("upload.modal.expires.day-plural"),
                      },
                      {
                        value: "-weeks",
                        label:
                          form.values.expiration_num == 1
                            ? t("upload.modal.expires.week-singular")
                            : t("upload.modal.expires.week-plural"),
                      },
                      {
                        value: "-months",
                        label:
                          form.values.expiration_num == 1
                            ? t("upload.modal.expires.month-singular")
                            : t("upload.modal.expires.month-plural"),
                      },
                      {
                        value: "-years",
                        label:
                          form.values.expiration_num == 1
                            ? t("upload.modal.expires.year-singular")
                            : t("upload.modal.expires.year-plural"),
                      },
                    ]}
                  />
                </Col>
              </Grid>
              <Checkbox
                label={t("upload.modal.expires.never-long")}
                {...form.getInputProps("never_expires")}
              />
              <Text
                italic
                size="xs"
                sx={(theme) => ({
                  color: theme.colors.gray[6],
                })}
              >
                {getExpirationPreview(
                  {
                    neverExpires: t("upload.modal.completed.never-expires"),
                    expiresOn: t("upload.modal.completed.expires-on"),
                  },
                  form,
                )}
              </Text>
            </>
          )}
          <Accordion>
            <Accordion.Item value="description" sx={{ borderBottom: "none" }}>
              <Accordion.Control>
                <FormattedMessage id="upload.modal.accordion.description.title" />
              </Accordion.Control>
              <Accordion.Panel>
                <Stack align="stretch">
                  <Textarea
                    variant="filled"
                    placeholder={t(
                      "upload.modal.accordion.description.placeholder",
                    )}
                    {...form.getInputProps("description")}
                  />
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
            {options.enableEmailRecepients && (
              <Accordion.Item value="recipients" sx={{ borderBottom: "none" }}>
                <Accordion.Control>
                  <FormattedMessage id="upload.modal.accordion.email.title" />
                </Accordion.Control>
                <Accordion.Panel>
                  <MultiSelect
                    data={form.values.recipients}
                    placeholder={t("upload.modal.accordion.email.placeholder")}
                    searchable
                    creatable
                    autoComplete="email-recipients"
                    getCreateLabel={(query) => `+ ${query}`}
                    onCreate={(query) => {
                      if (!query.match(/^\S+@\S+\.\S+$/)) {
                        form.setFieldError(
                          "recipients",
                          t("upload.modal.accordion.email.invalid-email"),
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
                    {...form.getInputProps("recipients")}
                  />
                </Accordion.Panel>
              </Accordion.Item>
            )}

            <Accordion.Item value="security" sx={{ borderBottom: "none" }}>
              <Accordion.Control>
                <FormattedMessage id="upload.modal.accordion.security.title" />
              </Accordion.Control>
              <Accordion.Panel>
                <Stack align="stretch">
                  <PasswordInput
                    variant="filled"
                    placeholder={t(
                      "upload.modal.accordion.security.password.placeholder",
                    )}
                    label={t("upload.modal.accordion.security.password.label")}
                    autoComplete="off"
                    {...form.getInputProps("password")}
                  />
                  <NumberInput
                    min={1}
                    type="number"
                    variant="filled"
                    placeholder={t(
                      "upload.modal.accordion.security.max-views.placeholder",
                    )}
                    label={t("upload.modal.accordion.security.max-views.label")}
                    {...form.getInputProps("maxViews")}
                  />
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
          <Button type="submit" data-autofocus>
            <FormattedMessage id="common.button.share" />
          </Button>
        </Stack>
      </form>
    </>
  );
};

export default showCreateUploadModal;
