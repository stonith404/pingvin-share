import { ActionIcon, Avatar, Menu } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { DoorExit, Link } from "tabler-icons-react";
import authService from "../../services/auth.service";

const ActionAvatar = () => {
  return (
    <Menu>
      <Menu.Target>
        <ActionIcon>
          <Avatar size={28} radius="xl" />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          component={NextLink}
          href="/account/shares"
          icon={<Link size={14} />}
        >
          My shares
        </Menu.Item>
        <Menu.Item
          onClick={async () => {
            authService.signOut();
          }}
          icon={<DoorExit size={14} />}
        >
          Sign out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ActionAvatar;
