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
  Tooltip,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TbEdit, TbInfoCircle, TbLink, TbLock, TbTrash } from "react-icons/tb";
import { FormattedMessage } from "react-intl";
import Meta from "../../components/Meta";
import showShareInformationsModal from "../../components/account/showShareInformationsModal";
import showShareLinkModal from "../../components/account/showShareLinkModal";
import CenterLoader from "../../components/core/CenterLoader";
import useConfig from "../../hooks/config.hook";
import useTranslate from "../../hooks/useTranslate.hook";
import shareService from "../../services/share.service";
import { MyShare } from "../../types/share.type";
import toast from "../../utils/toast.util";

const MyShares = () => {
  const modals = useModals();
  const clipboard = useClipboard();
  const config = useConfig();
  const t = useTranslate();

  const [shares, setShares] = useState<MyShare[]>();

  useEffect(() => {
    shareService.getMyShares().then((shares) => setShares(shares));
  }, []);

  if (!shares) return <CenterLoader />;

  return (
    <>
      <Meta title={t("account.shares.title")} />
      <Title mb={30} order={3}>
        <FormattedMessage id="account.shares.title" />
      </Title>
      {shares.length == 0 ? (
        <Center style={{ height: "70vh" }}>
          <Stack align="center" spacing={10}>
            <Title order={3}>
              <FormattedMessage id="account.shares.title.empty" />
            </Title>
            <Text>
              <FormattedMessage id="account.shares.description.empty" />
            </Text>
            <Space h={5} />
            <Button component={Link} href="/upload" variant="light">
              <FormattedMessage id="account.shares.button.create" />
            </Button>
          </Stack>
        </Center>
      ) : (
        <Box sx={{ display: "block", overflowX: "auto" }}>
          <Table>
            <thead>
              <tr>
                <th>
                  <FormattedMessage id="account.shares.table.id" />
                </th>
                <th>
                  <FormattedMessage id="account.shares.table.name" />
                </th>
                <th>
                  <FormattedMessage id="account.shares.table.visitors" />
                </th>
                <th>
                  <FormattedMessage id="account.shares.table.expiresAt" />
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {shares.map((share) => (
                <tr key={share.id}>
                  <td>
                    <Group spacing="xs">
                      {share.id}{" "}
                      {share.security.passwordProtected && (
                        <TbLock
                          color="orange"
                          title={t("account.shares.table.password-protected")}
                        />
                      )}
                    </Group>
                  </td>
                  <td>{share.name}</td>
                  <td>
                    {share.security.maxViews ? (
                      <FormattedMessage
                        id="account.shares.table.visitor-count"
                        values={{
                          count: share.views,
                          max: share.security.maxViews,
                        }}
                      />
                    ) : (
                      share.views
                    )}
                  </td>
                  <td>
                    {moment(share.expiration).unix() === 0 ? (
                      <FormattedMessage id="account.shares.table.expiry-never" />
                    ) : (
                      moment(share.expiration).format("LLL")
                    )}
                  </td>
                  <td>
                    <Group position="right">
                      <Link href={`/share/${share.id}/edit`}>
                        <Tooltip
                          position="bottom"
                          multiline
                          width={45}
                          label={t("common.button.edit")}
                          events={{
                            hover: true,
                            focus: false,
                            touch: true,
                          }}
                        >
                          <ActionIcon color="orange" variant="light" size={25}>
                            <TbEdit />
                          </ActionIcon>
                        </Tooltip>
                      </Link>
                      <Tooltip
                        position="bottom"
                        multiline
                        width={45}
                        label={t("common.button.info")}
                        events={{
                          hover: true,
                          focus: false,
                          touch: true,
                        }}
                      >
                        <ActionIcon
                          color="blue"
                          variant="light"
                          size={25}
                          onClick={() => {
                            showShareInformationsModal(
                              modals,
                              share,
                              parseInt(config.get("share.maxSize")),
                            );
                          }}
                        >
                          <TbInfoCircle />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip
                        position="bottom"
                        multiline
                        width={80}
                        label={t("common.button.copy-link")}
                        events={{
                          hover: true,
                          focus: false,
                          touch: true,
                        }}
                      >
                        <ActionIcon
                          color="victoria"
                          variant="light"
                          size={25}
                          onClick={() => {
                            if (window.isSecureContext) {
                              clipboard.copy(
                                `${window.location.origin}/s/${share.id}`,
                              );
                              toast.success(t("common.notify.copied-link"));
                            } else {
                              showShareLinkModal(modals, share.id);
                            }
                          }}
                        >
                          <TbLink />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip
                        position="bottom"
                        multiline
                        width={60}
                        label={t("common.button.delete")}
                        events={{
                          hover: true,
                          focus: false,
                          touch: true,
                        }}
                      >
                        <ActionIcon
                          color="red"
                          variant="light"
                          size={25}
                          onClick={() => {
                            modals.openConfirmModal({
                              title: t("account.shares.modal.delete.title", {
                                share: share.id,
                              }),
                              children: (
                                <Text size="sm">
                                  <FormattedMessage id="account.shares.modal.delete.description" />
                                </Text>
                              ),
                              confirmProps: {
                                color: "red",
                              },
                              labels: {
                                confirm: t("common.button.delete"),
                                cancel: t("common.button.cancel"),
                              },
                              onConfirm: () => {
                                shareService.remove(share.id);
                                setShares(
                                  shares.filter((item) => item.id !== share.id),
                                );
                              },
                            });
                          }}
                        >
                          <TbTrash />
                        </ActionIcon>
                      </Tooltip>
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
