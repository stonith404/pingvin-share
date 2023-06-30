import {
  Accordion,
  ActionIcon,
  Anchor,
  Box,
  Button,
  Center,
  Group,
  Stack,
  Table,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import moment from "moment";
import { useEffect, useState } from "react";
import { TbInfoCircle, TbLink, TbPlus, TbTrash } from "react-icons/tb";
import Meta from "../../components/Meta";
import showReverseShareLinkModal from "../../components/account/showReverseShareLinkModal";
import showShareLinkModal from "../../components/account/showShareLinkModal";
import CenterLoader from "../../components/core/CenterLoader";
import showCreateReverseShareModal from "../../components/share/modals/showCreateReverseShareModal";
import useConfig from "../../hooks/config.hook";
import shareService from "../../services/share.service";
import { MyReverseShare } from "../../types/share.type";
import { byteToHumanSizeString } from "../../utils/fileSize.util";
import toast from "../../utils/toast.util";

const MyShares = () => {
  const modals = useModals();
  const clipboard = useClipboard();

  const config = useConfig();

  const [reverseShares, setReverseShares] = useState<MyReverseShare[]>();

  const appUrl = config.get("general.appUrl");

  const getReverseShares = () => {
    shareService
      .getMyReverseShares()
      .then((shares) => setReverseShares(shares));
  };

  useEffect(() => {
    getReverseShares();
  }, []);

  if (!reverseShares) return <CenterLoader />;
  return (
    <>
      <Meta title="My shares" />
      <Group position="apart" align="baseline" mb={20}>
        <Group align="center" spacing={3} mb={30}>
          <Title order={3}>My reverse shares</Title>
          <Tooltip
            position="bottom"
            multiline
            width={220}
            label="A reverse share allows you to generate a unique URL that allows external users to create a share."
            events={{ hover: true, focus: false, touch: true }}
          >
            <ActionIcon>
              <TbInfoCircle />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Button
          onClick={() =>
            showCreateReverseShareModal(
              modals,
              config.get("smtp.enabled"),
              getReverseShares
            )
          }
          leftIcon={<TbPlus size={20} />}
        >
          Create
        </Button>
      </Group>
      {reverseShares.length == 0 ? (
        <Center style={{ height: "70vh" }}>
          <Stack align="center" spacing={10}>
            <Title order={3}>It's empty here 👀</Title>
            <Text>You don't have any reverse shares.</Text>
          </Stack>
        </Center>
      ) : (
        <Box sx={{ display: "block", overflowX: "auto" }}>
          <Table>
            <thead>
              <tr>
                <th>Shares</th>
                <th>Remaining uses</th>
                <th>Max share size</th>
                <th>Expires at</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reverseShares.map((reverseShare) => (
                <tr key={reverseShare.id}>
                  <td style={{ width: 220 }}>
                    {reverseShare.shares.length == 0 ? (
                      <Text color="dimmed" size="sm">
                        No shares created yet
                      </Text>
                    ) : (
                      <Accordion>
                        <Accordion.Item
                          value="customization"
                          sx={{ borderBottom: "none" }}
                        >
                          <Accordion.Control p={0}>
                            <Text size="sm">
                              {`${reverseShare.shares.length} share${
                                reverseShare.shares.length > 1 ? "s" : ""
                              }`}
                            </Text>
                          </Accordion.Control>
                          <Accordion.Panel>
                            {reverseShare.shares.map((share) => (
                              <Group key={share.id} mb={4}>
                                <Anchor href={`${appUrl}/share/${share.id}`}>
                                  <Text maw={120} truncate>
                                    {share.id}
                                  </Text>
                                </Anchor>
                                <ActionIcon
                                  color="victoria"
                                  variant="light"
                                  size={25}
                                  onClick={() => {
                                    if (window.isSecureContext) {
                                      clipboard.copy(
                                        `${appUrl}/share/${share.id}`
                                      );
                                      toast.success(
                                        "The share link was copied to the keyboard."
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
                                  <TbLink />
                                </ActionIcon>
                              </Group>
                            ))}
                          </Accordion.Panel>
                        </Accordion.Item>
                      </Accordion>
                    )}
                  </td>
                  <td>{reverseShare.remainingUses}</td>
                  <td>
                    {byteToHumanSizeString(parseInt(reverseShare.maxShareSize))}
                  </td>
                  <td>
                    {moment(reverseShare.shareExpiration).unix() === 0
                      ? "Never"
                      : moment(reverseShare.shareExpiration).format("LLL")}
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
                              `${config.get("general.appUrl")}/upload/${
                                reverseShare.token
                              }`
                            );
                            toast.success(
                              "The link was copied to your clipboard."
                            );
                          } else {
                            showReverseShareLinkModal(
                              modals,
                              reverseShare.token,
                              config.get("general.appUrl")
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
                            title: `Delete reverse share`,
                            children: (
                              <Text size="sm">
                                Do you really want to delete this reverse share?
                                If you do, the associated shares will be deleted
                                as well.
                              </Text>
                            ),
                            confirmProps: {
                              color: "red",
                            },
                            labels: { confirm: "Delete", cancel: "Cancel" },
                            onConfirm: () => {
                              shareService.removeReverseShare(reverseShare.id);
                              setReverseShares(
                                reverseShares.filter(
                                  (item) => item.id !== reverseShare.id
                                )
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
