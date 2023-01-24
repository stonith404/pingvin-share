import { ActionIcon, Menu } from "@mantine/core";
import { useModals } from "@mantine/modals";
import Link from "next/link";
import { TbLink, TbPlus } from "react-icons/tb";
import useUser from "../../hooks/user.hook";

const NavbarShareMneu = () => {
  const modals = useModals();
  const { user } = useUser();

  return (
    <Menu position="bottom-start" withinPortal>
      <Menu.Target>
        <ActionIcon>
          <TbLink />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item component={Link} href="/account/shares" icon={<TbLink />}>
          My shares
        </Menu.Item>
        <Menu.Item
          component={Link}
          href="/account/reverseShares"
          icon={<TbPlus />}
        >
          Reverse shares
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default NavbarShareMneu;
