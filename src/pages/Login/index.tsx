import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Link as LinkRouter, useNavigate } from "react-router-dom";

import {
  Button,
  Center,
  Flex,
  Heading,
  Input,
  Link,
  useToast,
} from "@chakra-ui/react";

import { User } from "../../@types";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { api } from "../../utils/api";
import { useAuth } from "../../hooks/useAuth";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { login } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    try {
      await login(username, password);
    } catch (error: any) {
      setLoading(false);
      toast({
        title: "Erro",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUsername = (value: string) => {
    setUsername(value);
  };

  const handlePassword = (value: string) => {
    setPassword(value);
  };

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      background="gray.500"
    >
      <Flex direction="column" background="gray.300" p={12} rounded={6}>
        <Heading mb={6}>Entrar</Heading>
        <Input
          placeholder="email@dominio.com"
          variant="filled"
          mb={3}
          type="email"
          value={username}
          onChange={(e: any) => handleUsername(e.target.value)}
        />
        <Input
          placeholder="********"
          variant="filled"
          mb={6}
          type="password"
          onChange={(e: any) => handlePassword(e.target.value)}
        />
        <Button
          isLoading={loading}
          loadingText="Aguarde..."
          colorScheme="teal"
          onClick={handleLogin}
        >
          Entrar
        </Button>
        <Center>
          <Link pt={5} as={LinkRouter} to="/register">
            Novo por aqui? Crie uma conta
          </Link>
        </Center>
      </Flex>
    </Flex>
  );
};
