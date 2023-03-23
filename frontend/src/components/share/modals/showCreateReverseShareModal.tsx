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
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { FormattedMessage, useIntl } from "react-intl";
import shareService from "../../../services/share.service";
import { getExpirationPreview } from "../../../utils/date.util";
import toast from "../../../utils/toast.util";
import FileSizeInput from "../FileSizeInput";
import showCompletedReverseShareModal from "./showCompletedReverseShareModal";

const showCreateReverseShareModal = (
  modals: ModalsContextProps,
  showSendEmailNotificationOption: boolean,
  getReverseShares: () => void
) => {
  return modals.openModal({
    title: "Create reverse share",
    children: (
      <Body
        showSendEmailNotificationOption={showSendEmailNotificationOption}
        getReverseShares={getReverseShares}
      />
    ),
  });
};

const Body = ({
  getReverseShares,
  showSendEmailNotificationOption,
}: {
  getReverseShares: () => void;
  showSendEmailNotificationOption: boolean;
}) => {
  const modals = useModals();
  const intl = useIntl();

  const form = useForm({
    initialValues: {
      maxShareSize: 104857600,
      maxUseCount: 1,
      sendEmailNotification: false,
      expiration_num: 1,
      expiration_unit: "-days",
    },
  });
  return (
    <Group>
      <form
        onSubmit={form.onSubmit(async (values) => {
          shareService
            .createReverseShare(
              values.expiration_num + values.expiration_unit,
              values.maxShareSize,
              values.maxUseCount,
              values.sendEmailNotification
            )
            .then(({ link }) => {
              modals.closeAll();
              showCompletedReverseShareModal(modals, link, getReverseShares);
            })
            .catch(toast.axiosError);
        })}
      >
        <Stack align="stretch">
          <div>
            <Grid align={form.errors.link ? "center" : "flex-end"}>
              <Col xs={6}>
                <NumberInput
                  min={1}
                  max={99999}
                  precision={0}
                  variant="filled"
                  label={intl.formatMessage({id:"account.reverseShares.modal.expiration.label"})}
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
                          form.values.expiration_num == 1 ?
                              intl.formatMessage({id: "upload.modal.expires.minute-singular"})
                              : intl.formatMessage({id: "upload.modal.expires.minute-plural"})
                    },
                    {
                      value: "-hours",
                      label:
                          form.values.expiration_num == 1 ?
                              intl.formatMessage({id: "upload.modal.expires.hour-singular"})
                              : intl.formatMessage({id: "upload.modal.expires.hour-plural"})
                    },
                    {
                      value: "-days",
                      label:
                          form.values.expiration_num == 1 ?
                              intl.formatMessage({id: "upload.modal.expires.day-singular"})
                              : intl.formatMessage({id: "upload.modal.expires.day-plural"})
                    },
                    {
                      value: "-weeks",
                      label:
                          form.values.expiration_num == 1 ?
                              intl.formatMessage({id: "upload.modal.expires.week-singular"})
                              : intl.formatMessage({id: "upload.modal.expires.week-plural"})
                    },
                    {
                      value: "-months",
                      label:
                          form.values.expiration_num == 1 ?
                              intl.formatMessage({id: "upload.modal.expires.month-singular"})
                              : intl.formatMessage({id: "upload.modal.expires.month-plural"})
                    },
                    {
                      value: "-years",
                      label:
                          form.values.expiration_num == 1 ?
                              intl.formatMessage({id: "upload.modal.expires.year-singular"})
                              : intl.formatMessage({id: "upload.modal.expires.year-plural"})
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
              {/* TODO: Translate this */}
              {getExpirationPreview("reverse share", form)}
            </Text>
          </div>
          <FileSizeInput
            label={intl.formatMessage({id:"account.reverseShares.modal.max-size.label"})}
            value={form.values.maxShareSize}
            onChange={(number) => form.setFieldValue("maxShareSize", number)}
          />
          <NumberInput
            min={1}
            max={1000}
            precision={0}
            variant="filled"
            label={intl.formatMessage({id:"account.reverseShares.modal.max-use.label"})}
            description={intl.formatMessage({id:"account.reverseShares.modal.max-use.description"})}
            {...form.getInputProps("maxUseCount")}
          />
          {showSendEmailNotificationOption && (
            <Switch
              mt="xs"
              labelPosition="left"
              label={intl.formatMessage({id:"account.reverseShares.modal.send-email"})}
              description={intl.formatMessage({id:"account.reverseShares.modal.send-email.description"})}
              {...form.getInputProps("sendEmailNotification", {
                type: "checkbox",
              })}
            />
          )}

          <Button mt="md" type="submit">
            <FormattedMessage id="common.button.create" />
          </Button>
        </Stack>
      </form>
    </Group>
  );
};

export default showCreateReverseShareModal;
