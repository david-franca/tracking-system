import { AxiosError } from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

import { useAppDispatch } from "../../hooks/useStore";
import { register } from "../../redux/features/auth";

Yup.setLocale(ptForm);

export const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const toast = useToast();

  const formSchema = Yup.object().shape({
    username: Yup.string().required().min(3),
    password: Yup.string().required().min(8),
    role: Yup.string().required(),
  });
  const { handleSubmit, errors, touched, handleChange, values } = useFormik({
    initialValues: { username: "", password: "", role: "" },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      setLoading(true);
      dispatch(register(values))
        .unwrap()
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
    },
  });

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      background="gray.500"
    >
      <Flex direction="column" background="gray.300" p={12} rounded={6}>
        <Heading mb={6}>Registrar</Heading>
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
                Nome de Usuário
              </FormLabel>
              <Input
                id="username"
                placeholder="fulano"
                variant="filled"
                type="text"
                value={values.username}
                onChange={handleChange}
              />
              <FormErrorMessage>
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
              <FormErrorMessage>
                <Flex>
                  <FormErrorIcon />
                  <Text>{touched.password && errors.password}</Text>
                </Flex>
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired
              isInvalid={touched.role && Boolean(errors.role)}
            >
              <FormLabel
                htmlFor="role"
                ms="4px"
                fontSize="sm"
                fontWeight="normal"
              >
                Regra de Acesso
              </FormLabel>
              <Select
                id="role"
                placeholder="Select a role"
                variant="filled"
                value={values.role}
                onChange={handleChange}
              >
                <option value="MASTER">Master</option>
                <option value="DEVELOPER">Developer</option>
                <option value="TESTER">Tester</option>
              </Select>
              <FormErrorMessage>
                <Flex>
                  <FormErrorIcon />
                  <Text>{touched.role && errors.role}</Text>
                </Flex>
              </FormErrorMessage>
            </FormControl>

            <Center pt={5}>
              <Button
                isLoading={loading}
                loadingText="Aguarde..."
                width="100%"
                colorScheme="teal"
                type="submit"
              >
                Registrar
              </Button>
            </Center>
          </Stack>
        </form>
      </Flex>
    </Flex>
  );
};
