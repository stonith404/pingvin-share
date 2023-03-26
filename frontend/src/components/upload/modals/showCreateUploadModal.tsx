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
import { useState } from "react";
import { TbAlertCircle } from "react-icons/tb";
import * as yup from "yup";
import shareService from "../../../services/share.service";
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
    allowUnauthenticatedShares: boolean;
    enableEmailRecepients: boolean;
  };
}) => {
  const modals = useModals();

  const [showNotSignedInAlert, setShowNotSignedInAlert] = useState(true);

  const validationSchema = yup.object().shape({
    link: yup
      .string()
      .required()
      .min(3)
      .max(50)
      .matches(new RegExp("^[a-zA-Z0-9_-]*$"), {
        message: "只能包含字母、数字、下划线和连字符",
      }),
    password: yup.string().min(3).max(30),
    maxViews: yup.number().min(1),
  });
  const form = useForm({
    initialValues: {
      link: "",
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
  return (
    <>
      {showNotSignedInAlert && !options.isUserSignedIn && (
        <Alert
          withCloseButton
          onClose={() => setShowNotSignedInAlert(false)}
          icon={<TbAlertCircle size={16} />}
          title="您尚未登录"
          color="yellow"
        >
          您将无法手动删除共享并查看访问者计数.
        </Alert>
      )}
      <form
        onSubmit={form.onSubmit(async (values) => {
          if (!(await shareService.isShareIdAvailable(values.link))) {
            form.setFieldError("link", "此链接已在使用中");
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
        })}
      >
        <Stack align="stretch">
          <Grid align={form.errors.link ? "center" : "flex-end"}>
            <Col xs={9}>
              <TextInput
                variant="filled"
                label="链接"
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
                生成
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
                        value: "-分钟",
                        label:
                          "分钟" +
                          (form.values.expiration_num == 1 ? "" : " "),
                      },
                      {
                        value: "-小时",
                        label:
                          "小时" + (form.values.expiration_num == 1 ? "" : " "),
                      },
                      {
                        value: "-天",
                        label:
                          "天" + (form.values.expiration_num == 1 ? "" : " "),
                      },
                      {
                        value: "-周",
                        label:
                          "周" + (form.values.expiration_num == 1 ? "" : " "),
                      },
                      {
                        value: "-月",
                        label:
                          "月" +
                          (form.values.expiration_num == 1 ? "" : " "),
                      },
                      {
                        value: "-年",
                        label:
                          "年" + (form.values.expiration_num == 1 ? "" : " "),
                      },
                    ]}
                  />
                </Col>
              </Grid>
              <Checkbox
                label="永久有效"
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
            <Accordion.Item value="description" sx={{ borderBottom: "none" }}>
              <Accordion.Control>描述</Accordion.Control>
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
            {options.enableEmailRecepients && (
              <Accordion.Item value="recipients" sx={{ borderBottom: "none" }}>
                <Accordion.Control>邮件接收设置</Accordion.Control>
                <Accordion.Panel>
                  <MultiSelect
                    data={form.values.recipients}
                    placeholder="输入邮件收件人"
                    searchable
                    {...form.getInputProps("recipients")}
                    creatable
                    getCreateLabel={(query) => `+ ${query}`}
                    onCreate={(query) => {
                      if (!query.match(/^\S+@\S+\.\S+$/)) {
                        form.setFieldError(
                          "recipients",
                          "无效的电子邮件地址"
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

            <Accordion.Item value="security" sx={{ borderBottom: "none" }}>
              <Accordion.Control>安全选项</Accordion.Control>
              <Accordion.Panel>
                <Stack align="stretch">
                  <PasswordInput
                    variant="filled"
                    placeholder="No password"
                    label="密码保护"
                    {...form.getInputProps("password")}
                  />
                  <NumberInput
                    min={1}
                    type="number"
                    variant="filled"
                    placeholder="No limit"
                    label="最大浏览"
                    {...form.getInputProps("maxViews")}
                  />
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
          <Button type="submit">分享</Button>
        </Stack>
      </form>
    </>
  );
};

export default showCreateUploadModal;
