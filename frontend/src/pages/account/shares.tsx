import {
    ActionIcon,
    Box,
    Button,
    Center,
    Group,
    Space,
    Stack,
    Table,
    Text,
    Title,
} from "@mantine/core";
import {useClipboard} from "@mantine/hooks";
import {useModals} from "@mantine/modals";
import moment from "moment";
import Link from "next/link";
import {useEffect, useState} from "react";
import {TbLink, TbTrash} from "react-icons/tb";
import {FormattedMessage, useIntl} from "react-intl";
import showShareLinkModal from "../../components/account/showShareLinkModal";
import CenterLoader from "../../components/core/CenterLoader";
import Meta from "../../components/Meta";
import useConfig from "../../hooks/config.hook";
import shareService from "../../services/share.service";
import {MyShare} from "../../types/share.type";
import toast from "../../utils/toast.util";

const MyShares = () => {
    const modals = useModals();
    const clipboard = useClipboard();
    const config = useConfig();
    const intl = useIntl();

    const [shares, setShares] = useState<MyShare[]>();

    useEffect(() => {
        shareService.getMyShares().then((shares) => setShares(shares));
    }, []);

    if (!shares) return <CenterLoader/>;

    return (
        <>
            <Meta title={intl.formatMessage({id: "account.shares.title"})}/>
            <Title mb={30} order={3}>
                <FormattedMessage id="account.shares.title"/>
            </Title>
            {shares.length == 0 ? (
                <Center style={{height: "70vh"}}>
                    <Stack align="center" spacing={10}>
                        <Title order={3}><FormattedMessage id="account.shares.title.empty"/></Title>
                        <Text><FormattedMessage id="account.shares.description.empty"/></Text>
                        <Space h={5}/>
                        <Button component={Link} href="/upload" variant="light">
                            <FormattedMessage id="account.shares.button.create"/>
                        </Button>
                    </Stack>
                </Center>
            ) : (
                <Box sx={{display: "block", overflowX: "auto"}}>
                    <Table>
                        <thead>
                        <tr>
                            <th><FormattedMessage id="account.shares.table.name"/></th>
                            <th><FormattedMessage id="account.shares.table.visitors"/></th>
                            <th><FormattedMessage id="account.shares.table.expires"/></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {shares.map((share) => (
                            <tr key={share.id}>
                                <td>{share.id}</td>
                                <td>{share.views}</td>
                                <td>
                                    {moment(share.expiration).unix() === 0
                                        ? "Never"
                                        : moment(share.expiration).format("LLL")}
                                </td>
                                <td>
                                    <Group position="right">
                                        <ActionIcon
                                            color="victoria"
                                            variant="light"
                                            size={25}
                                            onClick={() => {
                                                if (window.isSecureContext) {
                                                    clipboard.copy(
                                                        `${config.get("general.appUrl")}/share/${
                                                            share.id
                                                        }`
                                                    );
                                                    toast.success(
                                                        intl.formatMessage({id: "account.shares.notify.copied"})
                                                    );
                                                } else {
                                                    showShareLinkModal(
                                                        modals,
                                                        share.id,
                                                        config.get("general.appUrl")
                                                    );
                                                }
                                            }}
                                        >
                                            <TbLink/>
                                        </ActionIcon>
                                        <ActionIcon
                                            color="red"
                                            variant="light"
                                            size={25}
                                            onClick={() => {
                                                modals.openConfirmModal({
                                                    title: `Delete share ${share.id}`,
                                                    children: (
                                                        <Text size="sm">
                                                            Do you really want to delete this share?
                                                        </Text>
                                                    ),
                                                    confirmProps: {
                                                        color: "red",
                                                    },
                                                    labels: {
                                                        confirm: intl.formatMessage({id: "common.button.confirm"}),
                                                        cancel: intl.formatMessage({id: "common.button.cancel"})
                                                    },
                                                    onConfirm: () => {
                                                        shareService.remove(share.id);
                                                        setShares(
                                                            shares.filter((item) => item.id !== share.id)
                                                        );
                                                    },
                                                });
                                            }}
                                        >
                                            <TbTrash/>
                                        </ActionIcon>
                                    </Group>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </Box>
            )}
        </>
    );
};

export default MyShares;
