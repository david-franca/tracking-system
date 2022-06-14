import { HamburgerIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
} from "@chakra-ui/react";

import { useAppSelector } from "../../../hooks/useStore";

interface ActiveButtonProps {
  logout: () => void;
  createIssue: () => void;
}

const ActiveButton = ({ logout, createIssue }: ActiveButtonProps) => {
  const { user: payload } = useAppSelector((state) => state.auth);
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
      />
      <Portal>
        <MenuList>
          <MenuItem
            hidden={payload?.role === "DEVELOPER"}
            onClick={createIssue}
          >
            Criar Issue
          </MenuItem>
          <MenuItem color="red" onClick={logout}>
            Sair
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default ActiveButton;
