import { AxiosError } from "axios";
import { useState } from "react";

import {
  Button,
  Center,
  Flex,
  Heading,
  Input,
  Select,
  Stack,
  useToast,
} from "@chakra-ui/react";

import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  const handleRegister = () => {
    setLoading(true);
    api
      .post("/auth/register", { username, password, role })
      .then(() => {
        setLoading(false);
        toast({
          title: "Usuário Registrado.",
          description: "Faça login para continuar.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/");
      })
      .catch((error: AxiosError) => {
        setLoading(false);
        toast({
          title: "Erro",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  const handleUsername = (value: string) => {
    setUsername(value);
  };

  const handlePassword = (value: string) => {
    setPassword(value);
  };

  const handleRole = (value: string) => {
    setRole(value);
  };

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      background="gray.500"
    >
      <Flex direction="column" background="gray.300" p={12} rounded={6}>
        <Heading mb={6}>Registrar</Heading>
        <Stack spacing={5}>
          <Input
            placeholder="email@dominio.com"
            variant="filled"
            type="email"
            value={username}
            onChange={(e: any) => handleUsername(e.target.value)}
          />
          <Input
            placeholder="********"
            variant="filled"
            type="password"
            onChange={(e: any) => handlePassword(e.target.value)}
          />
          <Select
            placeholder="Select a role"
            variant="filled"
            value={role}
            onChange={(e: any) => handleRole(e.target.value)}
          >
            <option value="MASTER">Master</option>
            <option value="DEVELOPER">Developer</option>
            <option value="TESTER">Tester</option>
          </Select>
          <Center pt={5}>
            <Button
              isLoading={loading}
              loadingText="Aguarde..."
              width="100%"
              colorScheme="teal"
              onClick={handleRegister}
            >
              Registrar
            </Button>
          </Center>
        </Stack>
      </Flex>
    </Flex>
  );
};
