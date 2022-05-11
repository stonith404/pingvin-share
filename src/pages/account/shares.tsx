import {
  ActionIcon,
  Button,
  Center,
  Group,
  LoadingOverlay,
  Space,
  Table,
  Text,
  Title,
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { NextLink } from "@mantine/next";
import { Query } from "appwrite";
import moment from "moment";
import { useEffect, useState } from "react";
import { Link, Trash } from "tabler-icons-react";
import Meta from "../../components/Meta";
import shareService from "../../services/share.service";
import { ShareDocument } from "../../types/Appwrite.type";
import aw from "../../utils/appwrite.util";
import toast from "../../utils/toast.util";

const MyShares = () => {
  const modals = useModals();
  const clipboard = useClipboard();

  const [shares, setShares] = useState<ShareDocument[]>();

  useEffect(() => {
    aw.database
      .listDocuments<ShareDocument>(
        "shares",
        [Query.equal("enabled", true)],
        100
      )
      .then((res) => setShares(res.documents));
  }, []);

  if (!shares) return <LoadingOverlay visible />;
  return (
    <>
      <Meta title="My shares" />
      <Title mb={30} order={3}>
        My shares
      </Title>
      {shares.length == 0 ? (
        <Center style={{ height: "70vh" }}>
          <Group direction="column" align="center" spacing={10}>
            <Title order={3}>It's empty here 👀</Title>
            <Text>You don't have any shares.</Text>
            <Space h={5} />
            <Button component={NextLink} href="/upload" variant="light">
              Create one
            </Button>
          </Group>
        </Center>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Visitors</th>
              <th>Security enabled</th>
              <th>Email</th>
              <th>Expires at</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {shares.map((share) => (
              <tr key={share.$id}>
                <td>{share.$id}</td>
                <td>{share.visitorCount}</td>
                <td>{share.securityID ? "Yes" : "No"}</td>
                <td>{share.users!.length > 0 ? "Yes" : "No"}</td>
                <td>{moment(share.expiresAt).format("MMMM DD YYYY, HH:mm")}</td>
                <td>
                  <Group position="right">
                    <ActionIcon
                      color="victoria"
                      variant="light"
                      size={25}
                      onClick={() => {
                        clipboard.copy(
                          `${window.location.origin}/share/${share.$id}`
                        );
                        toast.success("Your link was copied to the keyboard.");
                      }}
                    >
                      <Link />
                    </ActionIcon>
                    <ActionIcon
                      color="red"
                      variant="light"
                      size={25}
                      onClick={() => {
                        modals.openConfirmModal({
                          title: `Delete share ${share.$id}`,
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
                            shareService.remove(share.$id);
                            setShares(
                              shares.filter((item) => item.$id !== share.$id)
                            );
                          },
                        });
                      }}
                    >
                      <Trash />
                    </ActionIcon>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default MyShares;
