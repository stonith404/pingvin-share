import { ActionIcon, Menu } from "@mantine/core";
import Link from "next/link";
import { TbArrowLoopLeft, TbLink } from "react-icons/tb";

const NavbarShareMneu = () => {
  return (
    <Menu position="bottom-start" withinPortal>
      <Menu.Target>
        <ActionIcon>
          <TbLink />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component={Link} href="/account/shares" icon={<TbLink />}>
          我的分享
        </Menu.Item>
        <Menu.Item
          component={Link}
          href="/account/reverseShares"
          icon={<TbArrowLoopLeft />}
        >
          外部分享
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default NavbarShareMneu;
