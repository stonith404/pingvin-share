import {
  Button,
  Col,
  Grid,
  Group,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { getCookie, setCookie } from "cookies-next";
import moment from "moment";
import { FormattedMessage } from "react-intl";
import * as yup from "yup";
import useTranslate, {
  translateOutsideContext,
} from "../../../hooks/useTranslate.hook";
import shareService from "../../../services/share.service";
import { Timespan } from "../../../types/timespan.type";
import { getExpirationPreview } from "../../../utils/date.util";
import toast from "../../../utils/toast.util";
import FileSizeInput from "../../core/FileSizeInput";
import showCompletedReverseShareModal from "./showCompletedReverseShareModal";

const showCreateReverseShareModal = (
  modals: ModalsContextProps,
  showSendEmailNotificationOption: boolean,
  maxExpiration: Timespan,
  getReverseShares: () => void,
) => {
  const t = translateOutsideContext();
  return modals.openModal({
    title: t("account.reverseShares.modal.title"),
    children: (
      <Body
        showSendEmailNotificationOption={showSendEmailNotificationOption}
        getReverseShares={getReverseShares}
        maxExpiration={maxExpiration}
      />
    ),
  });
};

const Body = ({
  getReverseShares,
  showSendEmailNotificationOption,
  maxExpiration,
}: {
  getReverseShares: () => void;
  showSendEmailNotificationOption: boolean;
  maxExpiration: Timespan;
}) => {
  const modals = useModals();
  const t = useTranslate();

  const form = useForm({
    initialValues: {
      maxShareSize: 104857600,
      maxUseCount: 1,
      sendEmailNotification: false,
      expiration_num: 1,
      expiration_unit: "-days",
      simplified: !!(getCookie("reverse-share.simplified") ?? false),
      publicAccess: !!(getCookie("reverse-share.public-access") ?? true),
    },
    validate: yupResolver(
      yup.object().shape({
        maxUseCount: yup
          .number()
          .typeError(t("common.error.invalid-number"))
          .min(1, t("common.error.number-too-small", { min: 1 }))
          .max(1000, t("common.error.number-too-large", { max: 1000 }))
          .required(t("common.error.field-required")),
      }),
    ),
  });

  const onSubmit = form.onSubmit(async (values) => {
    // remember simplified and publicAccess in cookies
    setCookie("reverse-share.simplified", values.simplified);
    setCookie("reverse-share.public-access", values.publicAccess);

    const expirationDate = moment().add(
      form.values.expiration_num,
      form.values.expiration_unit.replace(
        "-",
        "",
      ) as moment.unitOfTime.DurationConstructor,
    );
    if (
      maxExpiration.value != 0 &&
      expirationDate.isAfter(
        moment().add(maxExpiration.value, maxExpiration.unit),
      )
    ) {
      form.setFieldError(
        "expiration_num",
        t("upload.modal.expires.error.too-long", {
          max: moment
            .duration(maxExpiration.value, maxExpiration.unit)
            .humanize(),
        }),
      );
      return;
    }

    shareService
      .createReverseShare(
        values.expiration_num + values.expiration_unit,
        values.maxShareSize,
        values.maxUseCount,
        values.sendEmailNotification,
        values.simplified,
        values.publicAccess,
      )
      .then(({ link }) => {
        modals.closeAll();
        showCompletedReverseShareModal(modals, link, getReverseShares);
      })
      .catch(toast.axiosError);
  });

  return (
    <Group>
      <form onSubmit={onSubmit}>
        <Stack align="stretch">
          <div>
            <Grid align={form.errors.expiration_num ? "center" : "flex-end"}>
              <Col xs={6}>
                <NumberInput
                  min={1}
                  max={99999}
                  precision={0}
                  variant="filled"
                  label={t("account.reverseShares.modal.expiration.label")}
                  {...form.getInputProps("expiration_num")}
                />
              </Col>
              <Col xs={6}>
                <Select
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
            <Text
              mt="sm"
              italic
              size="xs"
              sx={(theme) => ({
                color: theme.colors.gray[6],
              })}
            >
              {getExpirationPreview(
                {
                  expiresOn: t("account.reverseShare.expires-on"),
                  neverExpires: t("account.reverseShare.never-expires"),
                },
                form,
              )}
            </Text>
          </div>
          <FileSizeInput
            label={t("account.reverseShares.modal.max-size.label")}
            value={form.values.maxShareSize}
            onChange={(number) => form.setFieldValue("maxShareSize", number)}
          />
          <NumberInput
            min={1}
            max={1000}
            precision={0}
            variant="filled"
            label={t("account.reverseShares.modal.max-use.label")}
            description={t("account.reverseShares.modal.max-use.description")}
            {...form.getInputProps("maxUseCount")}
          />
          {showSendEmailNotificationOption && (
            <Switch
              mt="xs"
              labelPosition="left"
              label={t("account.reverseShares.modal.send-email")}
              description={t(
                "account.reverseShares.modal.send-email.description",
              )}
              {...form.getInputProps("sendEmailNotification", {
                type: "checkbox",
              })}
            />
          )}
          <Switch
            mt="xs"
            labelPosition="left"
            label={t("account.reverseShares.modal.simplified")}
            description={t(
              "account.reverseShares.modal.simplified.description",
            )}
            {...form.getInputProps("simplified", {
              type: "checkbox",
            })}
          />
          <Switch
            mt="xs"
            labelPosition="left"
            label={t("account.reverseShares.modal.public-access")}
            description={t(
              "account.reverseShares.modal.public-access.description",
            )}
            {...form.getInputProps("publicAccess", {
              type: "checkbox",
            })}
          />
          <Button mt="md" type="submit">
            <FormattedMessage id="common.button.create" />
          </Button>
        </Stack>
      </form>
    </Group>
  );
};

export default showCreateReverseShareModal;
