import { HamburgerIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
} from "@chakra-ui/react";

interface ActiveButtonProps {
  logout: () => void;
  createIssue: () => void;
}

const ActiveButton = ({ logout, createIssue }: ActiveButtonProps) => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
      />
      <Portal>
        <MenuList>
          <MenuItem onClick={createIssue}>Criar Issue</MenuItem>
          <MenuItem color="red" onClick={logout}>
            Sair
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default ActiveButton;
