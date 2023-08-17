import {
  ActionIcon,
  Box,
  Button,
  Center,
  Group,
  MediaQuery,
  Space,
  Stack,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TbInfoCircle, TbLink, TbTrash } from "react-icons/tb";
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
                  <FormattedMessage id="account.shares.table.name" />
                </th>
                <MediaQuery smallerThan="md" styles={{ display: "none" }}>
                  <th>
                    <FormattedMessage id="account.shares.table.description" />
                  </th>
                </MediaQuery>

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
                  <td>{share.id}</td>
                  <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
                    <td
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: "300px",
                      }}
                    >
                      {share.description || ""}
                    </td>
                  </MediaQuery>
                  <td>{share.views}</td>
                  <td>
                    {moment(share.expiration).unix() === 0
                      ? "Never"
                      : moment(share.expiration).format("LLL")}
                  </td>
                  <td>
                    <Group position="right">
                      <ActionIcon
                        color="blue"
                        variant="light"
                        size={25}
                        onClick={() => {
                          showShareInformationsModal(
                            modals,
                            share,
                            config.get("general.appUrl"),
                            parseInt(config.get("share.maxSize")),
                          );
                        }}
                      >
                        <TbInfoCircle />
                      </ActionIcon>
                      <ActionIcon
                        color="victoria"
                        variant="light"
                        size={25}
                        onClick={() => {
                          if (window.isSecureContext) {
                            clipboard.copy(
                              `${config.get("general.appUrl")}/s/${share.id}`,
                            );
                            toast.success(t("common.notify.copied"));
                          } else {
                            showShareLinkModal(
                              modals,
                              share.id,
                              config.get("general.appUrl"),
                            );
                          }
                        }}
                      >
                        <TbLink />
                      </ActionIcon>
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
