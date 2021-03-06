import { useFormik } from "formik";
import { useState } from "react";
import { Link as LinkRouter, Navigate, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ptForm } from "yup-locale-pt";

import {
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { login } from "../../redux/features/auth";
import { store } from "../../redux/store";
import { handleError } from "../../utils/handleError";

Yup.setLocale(ptForm);

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formSchema = Yup.object().shape({
    username: Yup.string().required().min(3),
    password: Yup.string().required().min(8),
  });
  const { handleSubmit, errors, touched, handleChange, values } = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      console.log(values);
      setLoading(true);
      dispatch(login({ ...values }))
        .unwrap()
        .then(() => {
          setLoading(false);
          toast({
            title: "Login efetuado com sucesso.",
            description: "Redirecionando",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          navigate("/issues");
        })
        .catch((error) => {
          setLoading(false);
          const e = handleError(error);
          if (typeof e === "string") {
            toast({
              title: "Erro",
              description: e,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          } else {
            e?.forEach((err) => {
              toast({
                title: "Erro",
                description: err,
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            });
          }
        });
      try {
      } catch (error) {}
    },
  });

  if (isLoggedIn) {
    return <Navigate to="/issues" replace />;
  }

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      background="gray.500"
    >
      <Flex direction="column" background="gray.300" p={12} rounded={6}>
        <Heading mb={6}>Entrar</Heading>
        <form noValidate onSubmit={handleSubmit}>
          <Stack spacing={5}>
            <FormControl
              isRequired
              isInvalid={touched.username && Boolean(errors.username)}
            >
              <FormLabel
                htmlFor="username"
                ms="4px"
                fontSize="sm"
                fontWeight="normal"
              >
                Nome de Usu??rio
              </FormLabel>
              <Input
                id="username"
                placeholder="Nome de usu??rio"
                variant="filled"
                type="text"
                value={values.username}
                onChange={handleChange}
              />
              <FormErrorMessage ms="4px">
                <Flex>
                  <FormErrorIcon />
                  <Text>{touched.username && errors.username}</Text>
                </Flex>
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={touched.password && Boolean(errors.password)}
            >
              <FormLabel
                htmlFor="password"
                ms="4px"
                fontSize="sm"
                fontWeight="normal"
              >
                Senha
              </FormLabel>
              <Input
                id="password"
                placeholder="********"
                variant="filled"
                type="password"
                value={values.password}
                onChange={handleChange}
              />
              <FormErrorMessage ms="4px">
                <Flex>
                  <FormErrorIcon />
                  {touched.password && errors.password}
                </Flex>
              </FormErrorMessage>
            </FormControl>
            <Button
              w="100%"
              isLoading={loading}
              loadingText="Aguarde..."
              colorScheme="teal"
              type="submit"
            >
              Entrar
            </Button>
            <Center>
              <Link pt={5} as={LinkRouter} to="/register">
                Novo por aqui? Crie uma conta
              </Link>
            </Center>
          </Stack>
        </form>
      </Flex>
    </Flex>
  );
};
