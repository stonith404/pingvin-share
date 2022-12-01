import { ActionIcon, Avatar, Menu } from "@mantine/core";
import Link from "next/link";
import { TbDoorExit, TbLink, TbSettings } from "react-icons/tb";
import useUser from "../../hooks/user.hook";
import authService from "../../services/auth.service";

const ActionAvatar = () => {
  const user = useUser();

  return (
    <Menu position="bottom-start" withinPortal>
      <Menu.Target>
        <ActionIcon>
          <Avatar size={28} radius="xl" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          component={Link}
          href="/account/shares"
          icon={<TbLink size={14} />}
        >
          My shares
        </Menu.Item>
        {user!.isAdmin && (
          <Menu.Item
            component={Link}
            href="/admin/config"
            icon={<TbSettings size={14} />}
          >
            Administration
          </Menu.Item>
        )}

        <Menu.Item
          onClick={async () => {
            authService.signOut();
          }}
          icon={<TbDoorExit size={14} />}
        >
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ActionAvatar;
