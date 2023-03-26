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
import { useClipboard } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TbLink, TbTrash } from "react-icons/tb";
import showShareLinkModal from "../../components/account/showShareLinkModal";
import CenterLoader from "../../components/core/CenterLoader";
import Meta from "../../components/Meta";
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
      <Meta title="我的分享" />
      <Title mb={30} order={3}>
        我的分享
      </Title>
      {shares.length == 0 ? (
        <Center style={{ height: "70vh" }}>
          <Stack align="center" spacing={10}>
            <Title order={3}>这里是空的 👀</Title>
            <Text>你没有任何分享.</Text>
            <Space h={5} />
            <Button component={Link} href="/upload" variant="light">
              创建一个
            </Button>
          </Stack>
        </Center>
      ) : (
        <Box sx={{ display: "block", overflowX: "auto" }}>
          <Table>
            <thead>
              <tr>
                <th>名称</th>
                <th>访问者</th>
                <th>到期时间</th>
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
                              "您的链接已复制到剪贴板."
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
                            title: `删除分享 ${share.id}`,
                            children: (
                              <Text size="sm">
                                是否确实要删除此共享?
                              </Text>
                            ),
                            confirmProps: {
                              color: "red",
                            },
                            labels: { confirm: "确认", cancel: "取消" },
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
