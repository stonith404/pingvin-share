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
import Meta from "../../components/Meta";
import showShareInformationsModal from "../../components/account/showShareInformationsModal";
import showShareLinkModal from "../../components/account/showShareLinkModal";
import CenterLoader from "../../components/core/CenterLoader";
import useConfig from "../../hooks/config.hook";
import shareService from "../../services/share.service";
import { MyShare } from "../../types/share.type";
import toast from "../../utils/toast.util";

const MyShares = () => {
  const modals = useModals();
  const clipboard = useClipboard();
  const config = useConfig();

  const [shares, setShares] = useState<MyShare[]>();

  useEffect(() => {
    shareService.getMyShares().then((shares) => setShares(shares));
  }, []);

  if (!shares) return <CenterLoader />;

  return (
    <>
      <Meta title="My shares" />
      <Title mb={30} order={3}>
        My shares
      </Title>
      {shares.length == 0 ? (
        <Center style={{ height: "70vh" }}>
          <Stack align="center" spacing={10}>
            <Title order={3}>It's empty here 👀</Title>
            <Text>You don't have any shares.</Text>
            <Space h={5} />
            <Button component={Link} href="/upload" variant="light">
              Create one
            </Button>
          </Stack>
        </Center>
      ) : (
        <Box sx={{ display: "block", overflowX: "auto" }}>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <MediaQuery smallerThan="md" styles={{ display: "none" }}>
                  <th>Description</th>
                </MediaQuery>

                <th>Visitors</th>
                <th>Expires at</th>
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
                            parseInt(config.get("share.maxSize"))
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
                              `${config.get("general.appUrl")}/share/${
                                share.id
                              }`
                            );
                            toast.success(
                              "The link was copied to your clipboard."
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
                            labels: { confirm: "Confirm", cancel: "Cancel" },
                            onConfirm: () => {
                              shareService.remove(share.id);
                              setShares(
                                shares.filter((item) => item.id !== share.id)
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
