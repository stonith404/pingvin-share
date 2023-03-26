import {
  Accordion,
  ActionIcon,
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
import showShareLinkModal from "../../components/account/showShareLinkModal";
import CenterLoader from "../../components/core/CenterLoader";
import Meta from "../../components/Meta";
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
      <Meta title="我的分享" />
      <Group position="apart" align="baseline" mb={20}>
        <Group align="center" spacing={3} mb={30}>
          <Title order={3}>我的外部分享</Title>
          <Tooltip
            position="bottom"
            multiline
            width={220}
            label="外部分享允许您生成一个唯一的URL，该URL允许外部用户创建分享."
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
          创建
        </Button>
      </Group>
      {reverseShares.length == 0 ? (
        <Center style={{ height: "70vh" }}>
          <Stack align="center" spacing={10}>
            <Title order={3}>这里是空的 👀</Title>
            <Text>您没有任何外部分享.</Text>
          </Stack>
        </Center>
      ) : (
        <Box sx={{ display: "block", overflowX: "auto" }}>
          <Table>
            <thead>
              <tr>
                <th>分享</th>
                <th>剩余使用量</th>
                <th>最大共享大小</th>
                <th>到期时间</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reverseShares.map((reverseShare) => (
                <tr key={reverseShare.id}>
                  <td style={{ width: 220 }}>
                    {reverseShare.shares.length == 0 ? (
                      <Text color="dimmed" size="sm">
                        尚未创建共享
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
                                <Text maw={120} truncate>
                                  {share.id}
                                </Text>
                                <ActionIcon
                                  color="victoria"
                                  variant="light"
                                  size={25}
                                  onClick={() => {
                                    if (window.isSecureContext) {
                                      clipboard.copy(
                                        `${config.get(
                                          "general.appUrl"
                                        )}/share/${share.id}`
                                      );
                                      toast.success(
                                        "分享链接已复制到剪贴板."
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
                        color="red"
                        variant="light"
                        size={25}
                        onClick={() => {
                          modals.openConfirmModal({
                            title: `删除外部分享`,
                            children: (
                              <Text size="sm">
                                是否确实要删除此反向共享？
                                如果您这样做，关联的共享也将被删除.
                              </Text>
                            ),
                            confirmProps: {
                              color: "red",
                            },
                            labels: { confirm: "删除", cancel: "取消" },
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
