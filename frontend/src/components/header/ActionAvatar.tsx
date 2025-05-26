import { Button, Menu } from "@mantine/core";
import Link from "next/link";
import { TbDoorExit, TbSettings, TbUser, TbUserCircle } from "react-icons/tb";
import useUser from "../../hooks/user.hook";
import authService from "../../services/auth.service";
import { FormattedMessage, useIntl } from "react-intl";

const ActionAvatar = () => {
  const { user } = useUser();

  return (
    <Menu position="bottom-start" withinPortal>
      <Menu.Target>
        <Button
          variant="default"
          size="xs"
          leftIcon={<TbUserCircle size={18} />}
        >
          <FormattedMessage id="common.button.profile" />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component={Link} href="/account" icon={<TbUser size={14} />}>
          <FormattedMessage id="navbar.avatar.account" />
        </Menu.Item>
        {user!.isAdmin && (
          <Menu.Item
            component={Link}
            href="/admin"
            icon={<TbSettings size={14} />}
          >
            <FormattedMessage id="navbar.avatar.admin" />
          </Menu.Item>
        )}

        <Menu.Item
          onClick={async () => {
            await authService.signOut();
          }}
          icon={<TbDoorExit size={14} />}
        >
          <FormattedMessage id="navbar.avatar.signout" />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ActionAvatar;
