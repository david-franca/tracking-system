import { CloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
} from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";

interface ActiveButtonProps {
  logout: () => void;
  createIssue: () => void;
}

const ActiveButton = ({ logout, createIssue }: ActiveButtonProps) => {
  return (
    <Menu>
      <MenuButton as={Button}>Ações</MenuButton>
      <Portal>
        <MenuList>
          <MenuItem onClick={createIssue}>Criar Issue</MenuItem>
          <MenuItem onClick={logout}>Sair</MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  );
};

export default ActiveButton;
