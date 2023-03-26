import { Button, Group, Space, Text, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { TbPlus } from "react-icons/tb";
import ManageUserTable from "../../components/admin/users/ManageUserTable";
import showCreateUserModal from "../../components/admin/users/showCreateUserModal";
import Meta from "../../components/Meta";
import useConfig from "../../hooks/config.hook";
import userService from "../../services/user.service";
import User from "../../types/user.type";
import toast from "../../utils/toast.util";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const config = useConfig();
  const modals = useModals();

  const getUsers = () => {
    setIsLoading(true);
    userService.list().then((users) => {
      setUsers(users);
      setIsLoading(false);
    });
  };

  const deleteUser = (user: User) => {
    modals.openConfirmModal({
      title: `Delete ${user.username}?`,
      children: (
        <Text size="sm">
          你真的想删除 <b>{user.username}</b> 和所有的分享?
        </Text>
      ),
      labels: { confirm: "删除", cancel: "取消" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        userService
          .remove(user.id)
          .then(() => setUsers(users.filter((v) => v.id != user.id)))
          .catch(toast.axiosError);
      },
    });
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <Meta title="用户管理" />
      <Group position="apart" align="baseline" mb={20}>
        <Title mb={30} order={3}>
          用户管理
        </Title>
        <Button
          onClick={() =>
            showCreateUserModal(modals, config.get("smtp.enabled"), getUsers)
          }
          leftIcon={<TbPlus size={20} />}
        >
          创建
        </Button>
      </Group>

      <ManageUserTable
        users={users}
        getUsers={getUsers}
        deleteUser={deleteUser}
        isLoading={isLoading}
      />
      <Space h="xl" />
    </>
  );
};

export default Users;
