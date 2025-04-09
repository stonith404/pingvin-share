import { Button, Menu } from "@mantine/core";
import Link from "next/link";
import { TbArrowLoopLeft, TbLink } from "react-icons/tb";
import { FormattedMessage } from "react-intl";

const NavbarShareMneu = () => {
  return (
    <Menu position="bottom-start" withinPortal>
      <Menu.Target>
        <Button variant="default" size="sm" leftIcon={<TbLink size={18} />}>
          <FormattedMessage id="common.button.shares" />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component={Link} href="/account/shares" icon={<TbLink />}>
          <FormattedMessage id="navbar.links.shares" />
        </Menu.Item>
        <Menu.Item
          component={Link}
          href="/account/reverseShares"
          icon={<TbArrowLoopLeft />}
        >
          <FormattedMessage id="navbar.links.reverse" />
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default NavbarShareMneu;
