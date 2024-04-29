import { ActionIcon, Box, Group, MediaQuery, Skeleton, Table } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import moment from "moment";
import { TbLink, TbTrash } from "react-icons/tb";
import showShareLinkModal from "../../account/showShareLinkModal";
import useConfig from "../../../hooks/config.hook";
import useTranslate from "../../../hooks/useTranslate.hook";
import { MyShare } from "../../../types/share.type";
import { FormattedMessage, useIntl } from "react-intl";
import toast from "../../../utils/toast.util";

const ManageShareTable = ({
  shares,
  getShares,
  deleteShare,
  isLoading,
}: {
  shares: MyShare[];
  getShares: () => void;
  deleteShare: (share: MyShare) => void;
  isLoading: boolean;
}) => {
  const modals = useModals();
  const clipboard = useClipboard();
  const config = useConfig();
  const t = useTranslate();

  return (
    <Box sx={{ display: "block", overflowX: "auto" }}>
      <Table verticalSpacing="sm">
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
              <FormattedMessage id="admin.shares.table.username" />
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
          {isLoading
            ? skeletonRows
            : shares.map((share) => (
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
                <td>{share.creator.username}</td>
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
                      variant="light"
                      color="red"
                      size="sm"
                      onClick={() => deleteShare(share)}
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
  );
};

const skeletonRows = [...Array(10)].map((v, i) => (
  <tr key={i}>
    <td>
      <Skeleton key={i} height={20} />
    </td>
    <MediaQuery smallerThan="md" styles={{ display: "none" }}>
      <td>
        <Skeleton key={i} height={20} />
      </td>
    </MediaQuery>
    <td>
      <Skeleton key={i} height={20} />
    </td>
    <td>
      <Skeleton key={i} height={20} />
    </td>
    <td>
      <Skeleton key={i} height={20} />
    </td>
    <td>
      <Skeleton key={i} height={20} />
    </td>
  </tr>
));

export default ManageShareTable;
