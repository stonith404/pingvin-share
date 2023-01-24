import { ActionIcon, Menu } from "@mantine/core";
import { useModals } from "@mantine/modals";
import Link from "next/link";
import { TbLink, TbPlus } from "react-icons/tb";
import useUser from "../../hooks/user.hook";
import showCreateReverseShareModal from "../share/modals/showCreateReverseShareModal";

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
          onClick={() => showCreateReverseShareModal(modals)}
          icon={<TbPlus />}
        >
          Reverse share
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default NavbarShareMneu;
