import { Button, Group, Space, Text, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useEffect, useState } from "react";
import { TbPlus } from "react-icons/tb";
import { FormattedMessage } from "react-intl";
import Meta from "../../components/Meta";
import ManageUserTable from "../../components/admin/users/ManageUserTable";
import showCreateUserModal from "../../components/admin/users/showCreateUserModal";
import useConfig from "../../hooks/config.hook";
import useTranslate from "../../hooks/useTranslate.hook";
import userService from "../../services/user.service";
import User from "../../types/user.type";
import toast from "../../utils/toast.util";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const config = useConfig();
  const modals = useModals();
  const t = useTranslate();

  const getUsers = () => {
    setIsLoading(true);
    userService.list().then((users) => {
      setUsers(users);
      setIsLoading(false);
    });
  };

  const deleteUser = (user: User) => {
    modals.openConfirmModal({
      title: t("admin.users.edit.delete.title", {
        username: user.username,
      }),
      children: (
        <Text size="sm">
          <FormattedMessage id="admin.users.edit.delete.description" />
        </Text>
      ),
      labels: {
        confirm: t("common.button.delete"),
        cancel: t("common.button.cancel"),
      },
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
      <Meta title={t("admin.users.title")} />
      <Group position="apart" align="baseline" mb={20}>
        <Title mb={30} order={3}>
          <FormattedMessage id="admin.users.title" />
        </Title>
        <Button
          onClick={() =>
            showCreateUserModal(modals, config.get("smtp.enabled"), getUsers)
          }
          leftIcon={<TbPlus size={20} />}
        >
          <FormattedMessage id="common.button.create" />
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
