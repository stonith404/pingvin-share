import {
  ActionIcon,
  Button,
  Col,
  Grid,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import { ModalsContextProps } from "@mantine/modals/lib/context";
import { TbInfoCircle } from "react-icons/tb";
import shareService from "../../../services/share.service";
import { getExpirationPreview } from "../../../utils/date.util";
import toast from "../../../utils/toast.util";
import FileSizeInput from "../FileSizeInput";
import showCompletedReverseShareModal from "./showCompletedReverseShareModal";

const showCreateReverseShareModal = (modals: ModalsContextProps) => {
  return modals.openModal({
    title: (
      <Group align="center" spacing={3}>
        <Title order={4}>Create reverse share</Title>
        <Tooltip
          multiline
          width={220}
          label="A reverse share enables you to generate a unique URL for a single-use share for an external user."
          events={{ hover: true, focus: false, touch: true }}
        >
          <ActionIcon>
            <TbInfoCircle />
          </ActionIcon>
        </Tooltip>
      </Group>
    ),
    children: <Body />,
  });
};

const Body = () => {
  const modals = useModals();

  const form = useForm({
    initialValues: {
      maxShareSize: 104857600,
      expiration_num: 1,
      expiration_unit: "-days",
    },
  });
  return (
    <Group>
      <form
        onSubmit={form.onSubmit(async (values) => {
          shareService
            .createReverseShareToken(
              values.expiration_num + values.expiration_unit,
              values.maxShareSize
            )
            .then(({ link }) => {
              modals.closeAll();
              showCompletedReverseShareModal(modals, link);
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
                  label="Link expiration"
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
                        "Minute" + (form.values.expiration_num == 1 ? "" : "s"),
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
                        "Month" + (form.values.expiration_num == 1 ? "" : "s"),
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
              {getExpirationPreview("reverse share link", form)}
            </Text>
          </div>
          <FileSizeInput
            label="Max share size"
            value={form.values.maxShareSize}
            onChange={(number) => form.setFieldValue("maxShareSize", number)}
          />

          <Button mt="md" type="submit">
            Create
          </Button>
        </Stack>
      </form>
    </Group>
  );
};

export default showCreateReverseShareModal;
