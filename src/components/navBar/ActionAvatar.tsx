import { ActionIcon, Avatar, Menu, Switch } from "@mantine/core";
import { NextLink } from "@mantine/next";
import { DoorExit, Link, Moon } from "tabler-icons-react";
import aw from "../../utils/appwrite.util";
import ToggleThemeButton from "./ToggleThemeButton";

const ActionAvatar = () => {
  return (
    <Menu
      control={
        <ActionIcon>
          <Avatar size={28} radius="xl" />
        </ActionIcon>
      }
    >
      <Menu.Label>My account</Menu.Label>
      <Menu.Item
        component={NextLink}
        href="/account/shares"
        icon={<Link size={14} />}
      >
        Shares
      </Menu.Item>
      {/* <Menu.Item
        component={NextLink}
        href="/account/shares"
        icon={<Settings size={14} />}
      >
        Settings
      </Menu.Item> */}
      <Menu.Item
        onClick={async () => {
          await aw.account.deleteSession("current");
          window.location.reload();
        }}
        icon={<DoorExit size={14} />}
      >
        Sign out
      </Menu.Item>
      <Menu.Label>Settings</Menu.Label>
      <Menu.Item icon={<Moon size={14} />}>
        <ToggleThemeButton />
      </Menu.Item>
    </Menu>
  );
};

export default ActionAvatar;
