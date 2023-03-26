import { ActionIcon, Avatar, Menu } from "@mantine/core";
import Link from "next/link";
import { TbDoorExit, TbSettings, TbUser } from "react-icons/tb";
import useUser from "../../hooks/user.hook";
import authService from "../../services/auth.service";

const ActionAvatar = () => {
  const { user } = useUser();

  return (
    <Menu position="bottom-start" withinPortal>
      <Menu.Target>
        <ActionIcon>
          <Avatar size={28} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component={Link} href="/account" icon={<TbUser size={14} />}>
          我的账户
        </Menu.Item>
        {user!.isAdmin && (
          <Menu.Item
            component={Link}
            href="/admin"
            icon={<TbSettings size={14} />}
          >
            管理
          </Menu.Item>
        )}

        <Menu.Item
          onClick={async () => {
            await authService.signOut();
          }}
          icon={<TbDoorExit size={14} />}
        >
          退出登录
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ActionAvatar;
