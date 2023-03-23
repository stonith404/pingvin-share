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
import {useForm, yupResolver} from "@mantine/form";
import {useModals} from "@mantine/modals";
import {ModalsContextProps} from "@mantine/modals/lib/context";
import {useState} from "react";
import {TbAlertCircle} from "react-icons/tb";
import * as yup from "yup";
import shareService from "../../../services/share.service";
import {CreateShare} from "../../../types/share.type";
import {getExpirationPreview} from "../../../utils/date.util";
import {FormattedMessage, useIntl} from "react-intl";

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
        // TODO: Figure out how to get the intl object here
        // We can't use hooks since this is not a component
        // And we can't just render the <FormattedMessage> component because its out of context
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
    const intl = useIntl();

    const [showNotSignedInAlert, setShowNotSignedInAlert] = useState(true);

    const validationSchema = yup.object().shape({
        link: yup
            .string()
            .required()
            .min(3)
            .max(50)
            .matches(new RegExp("^[a-zA-Z0-9_-]*$"), {
                message: intl.formatMessage({id: "upload.modal.link.error.invalid"}),
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
                    icon={<TbAlertCircle size={16}/>}
                    title={intl.formatMessage({id: "upload.modal.not-signed-in"})}
                    color="yellow"
                >
                    You will be unable to delete your share manually and view the visitor
                    count.
                </Alert>
            )}
            <form
                onSubmit={form.onSubmit(async (values) => {
                    if (!(await shareService.isShareIdAvailable(values.link))) {
                        form.setFieldError("link", intl.formatMessage({id: "upload.modal.link.error.taken"}));
                    } else {
                        const expiration = form.values.never_expires
                            ? intl.formatMessage({id: "upload.modal.expires.never"})
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
                                label={intl.formatMessage({id: "upload.modal.link.label"})}
                                placeholder={intl.formatMessage({id: "upload.modal.link.placeholder"})}
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
                                <FormattedMessage id="common.button.generate"/>
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
                        {form.values.link == "" ? intl.formatMessage({id: "upload.modal.link.placeholder"}) : form.values.link}
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
                                        label={intl.formatMessage({id: "upload.modal.expires.label"})}
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
                            <Checkbox
                                label={intl.formatMessage({id: "upload.modal.expires.never-long"})}
                                {...form.getInputProps("never_expires")}
                            />
                            <Text
                                italic
                                size="xs"
                                sx={(theme) => ({
                                    color: theme.colors.gray[6],
                                })}
                            >
                                {/* TODO: Translate this */}
                                {getExpirationPreview("share", form)}
                            </Text>
                        </>
                    )}
                    <Accordion>
                        <Accordion.Item value="description" sx={{borderBottom: "none"}}>
                            <Accordion.Control><FormattedMessage
                                id="upload.modal.accordion.description.title"/></Accordion.Control>
                            <Accordion.Panel>
                                <Stack align="stretch">
                                    <Textarea
                                        variant="filled"
                                        placeholder={intl.formatMessage({id: "upload.modal.accordion.description.placeholder"})}
                                        {...form.getInputProps("description")}
                                    />
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>
                        {options.enableEmailRecepients && (
                            <Accordion.Item value="recipients" sx={{borderBottom: "none"}}>
                                <Accordion.Control><FormattedMessage
                                    id="upload.modal.accordion.email.tile"/></Accordion.Control>
                                <Accordion.Panel>
                                    <MultiSelect
                                        data={form.values.recipients}
                                        placeholder={intl.formatMessage({id: "upload.modal.accordion.email.placeholder"})}
                                        searchable
                                        {...form.getInputProps("recipients")}
                                        creatable
                                        getCreateLabel={(query) => `+ ${query}`}
                                        onCreate={(query) => {
                                            if (!query.match(/^\S+@\S+\.\S+$/)) {
                                                form.setFieldError(
                                                    "recipients",
                                                    intl.formatMessage({id: "upload.modal.accordion.email.invalid-email"})
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

                        <Accordion.Item value="security" sx={{borderBottom: "none"}}>
                            <Accordion.Control><FormattedMessage
                                id="upload.modal.accordion.security.title"/></Accordion.Control>
                            <Accordion.Panel>
                                <Stack align="stretch">
                                    <PasswordInput
                                        variant="filled"
                                        placeholder={intl.formatMessage({id: "upload.modal.accordion.security.password.placeholder"})}
                                        label={intl.formatMessage({id: "upload.modal.accordion.security.password.label"})}
                                        {...form.getInputProps("password")}
                                    />
                                    <NumberInput
                                        min={1}
                                        type="number"
                                        variant="filled"
                                        placeholder={intl.formatMessage({id: "upload.modal.accordion.security.max-views.placeholder"})}
                                        label={intl.formatMessage({id: "upload.modal.accordion.security.max-views.label"})}
                                        {...form.getInputProps("maxViews")}
                                    />
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                    <Button type="submit"><FormattedMessage id="common.button.share"/></Button>
                </Stack>
            </form>
        </>
    );
};

export default showCreateUploadModal;
