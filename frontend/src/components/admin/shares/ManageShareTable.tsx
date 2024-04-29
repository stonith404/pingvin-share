import { ActionIcon, Box, Group, Skeleton, Table } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { TbCheck, TbEdit, TbTrash } from "react-icons/tb";
import Share from "../../../types/share.type";
import { FormattedMessage, useIntl } from "react-intl";

const ManageShareTable = ({
  shares,
  getShares,
  deleteShare,
  isLoading,
}: {
  shares: Share[];
  getShares: () => void;
  deleteShare: (share: Share) => void;
  isLoading: boolean;
}) => {
  const modals = useModals();

  return (
    <Box sx={{ display: "block", overflowX: "auto" }}>
      <Table verticalSpacing="sm">
        <thead>
          <tr>
            <th>
              <FormattedMessage id="admin.shares.table.sharename" />
            </th>
            <th>
              <FormattedMessage id="admin.shares.table.email" />
            </th>
            <th>
              <FormattedMessage id="admin.shares.table.admin" />
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? skeletonRows
            : shares.map((share) => (
              <tr key={share.id}>
                <td>{share.sharename}</td>
                <td>{share.email}</td>
                <td>{share.isAdmin && <TbCheck />}</td>
                <td>
                  <Group position="right">
                    <ActionIcon
                      variant="light"
                      color="primary"
                      size="sm"
                      onClick={() =>
                        showUpdateShareModal(modals, share, getShares)
                      }
                    >
                      <TbEdit />
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
