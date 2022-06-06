import { HamburgerIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
} from "@chakra-ui/react";
import { useAuth } from "../../../hooks/useAuth";

interface ActiveButtonProps {
  logout: () => void;
  createIssue: () => void;
}

const ActiveButton = ({ logout, createIssue }: ActiveButtonProps) => {
  const { payload } = useAuth();
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
      />
      <Portal>
        <MenuList>
          <MenuItem hidden={payload.role === "DEVELOPER"} onClick={createIssue}>
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
