import { ActionIcon, Box, Group, Skeleton, Table } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { TbCheck, TbEdit, TbTrash } from "react-icons/tb";
import User from "../../../types/user.type";
import showUpdateUserModal from "./showUpdateUserModal";

const ManageUserTable = ({
  users,
  getUsers,
  deleteUser,
  isLoading,
}: {
  users: User[];
  getUsers: () => void;
  deleteUser: (user: User) => void;
  isLoading: boolean;
}) => {
  const modals = useModals();

  return (
    <Box sx={{ display: "block", overflowX: "auto" }}>
      <Table verticalSpacing="sm">
        <thead>
          <tr>
            <th>用户名</th>
            <th>邮箱</th>
            <th>管理员</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? skeletonRows
            : users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.isAdmin && <TbCheck />}</td>
                  <td>
                    <Group position="right">
                      <ActionIcon
                        variant="light"
                        color="primary"
                        size="sm"
                        onClick={() =>
                          showUpdateUserModal(modals, user, getUsers)
                        }
                      >
                        <TbEdit />
                      </ActionIcon>
                      <ActionIcon
                        variant="light"
                        color="red"
                        size="sm"
                        onClick={() => deleteUser(user)}
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

export default ManageUserTable;
