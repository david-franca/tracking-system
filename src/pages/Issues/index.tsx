import "react-datepicker/dist/react-datepicker.css";
import "moment/locale/pt-br";

import { AxiosError } from "axios";
import { useFormik } from "formik";
import * as moment from "moment";
import NP from "number-precision";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ptForm } from "yup-locale-pt";

import { TriangleDownIcon, TriangleUpIcon, UpDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  chakra,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Text,
  Th,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";

import { Issue, Priority } from "../../@types";
import { useAuth } from "../../hooks/useAuth";
import { useAxios } from "../../hooks/useAxios";
import { useSortableData } from "../../hooks/useSortableData";
import ActionsButtons from "./components/ActionsButtons";
import ActiveButton from "./components/ActiveButton";
import BadgesColored from "./components/BadgesColored";
import TableHead from "./components/TableHead";

moment.locale("pt-br");
Yup.setLocale(ptForm);

export const Issues = () => {
  const { signed, logout, payload, createIssue } = useAuth();
  const [take, setTake] = useState(10);
  const [tableValues, setTableValues] = useState<Issue[]>([]);
  const [pagination, setPagination] = useState<Issue[][]>([]);
  const [indexPage, setIndexPage] = useState(0);
  const [idsChecked, setIdsChecked] = useState<number[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const navigate = useNavigate();

  const { data: issues } = useAxios<Issue[], AxiosError>(
    "issues",
    payload.token
  );

  const { items, requestSort, sortConfig } = useSortableData(issues ?? []);

  const getClassNamesFor = (name: string) => {
    if (!sortConfig) {
      return;
    }

    return sortConfig.key === name ? (
      sortConfig.direction === "ascending" ? (
        <TriangleUpIcon />
      ) : (
        <TriangleDownIcon />
      )
    ) : (
      <UpDownIcon />
    );
  };

  const handleChecked = (id: number, isChecked: boolean) => {
    const values: number[] = [...idsChecked];
    if (isChecked) {
      values.push(id);
      setIdsChecked(values);
    } else {
      const index = values.findIndex((item) => item === id);
      values.splice(index, 1);
      setIdsChecked(values);
    }
  };

  useEffect(() => {
    if (items) {
      const i = [...items];

      const result = new Array(Math.ceil(i.length / take))
        .fill(i)
        .map((_) => i.splice(0, take));
      setPagination(result);

      setTableValues(result[indexPage]);
    }
  }, [take, items, indexPage]);

  const formSchema = Yup.object().shape({
    issue: Yup.string().required().min(2),
    version: Yup.string().required().min(2),
    description: Yup.string().required().min(2).max(200),
  });

  const { handleSubmit, values, handleChange, touched, errors } = useFormik({
    initialValues: {
      issue: "",
      version: "",
      description: "",
      priority: Priority.NORMAL,
      autor: payload.username,
    },
    validationSchema: formSchema,
    onSubmit: async (values) => {
      await createIssue(values);
      onClose();
    },
  });

  useEffect(() => {
    if (!signed) {
      navigate("/");
    }
  }, [signed]);

  const columns = useMemo(
    () => [
      { label: "ID", accessor: "id", sortable: true },
      { label: "Problema", accessor: "issue", sortable: true },
      { label: "Versão", accessor: "version", sortable: true },
      { label: "Autor", accessor: "autor", sortable: true },
      { label: "Descrição", accessor: "description", sortable: true },
      { label: "Prioridade", accessor: "priority", sortable: true },
      { label: "Data", accessor: "createdAt", sortable: true },
      { label: "Status", accessor: "status", sortable: true },
    ],
    []
  );

  return (
    <Flex height="100vh" justifyContent="center" background="gray.500">
      <Flex direction="column" p={12} rounded={6}>
        <Flex justifyContent="space-between">
          <Heading mb={6} color="white">
            Issue Tracking System
          </Heading>
          <Box>
            {idsChecked.length !== 0 ? (
              <Button colorScheme="red">Deletar Issues</Button>
            ) : null}
            <ActiveButton createIssue={onOpen} logout={logout} />
          </Box>
        </Flex>
        <TableContainer width="90vw" overflowY="auto">
          <Table background="gray.100">
            <TableHead
              columns={columns}
              getClassNamesFor={getClassNamesFor}
              requestSort={requestSort}
            />
            <Tbody>
              {tableValues
                ? tableValues.map((issue) => (
                    <Tr key={issue.id}>
                      <Th>
                        <Checkbox
                          value={issue.id}
                          isChecked={idsChecked.includes(issue.id)}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            handleChecked(Number(issue.id), e.target.checked);
                          }}
                        />
                      </Th>
                      <Th>{issue.id}</Th>
                      <Th>{issue.issue}</Th>
                      <Th>{issue.version}</Th>
                      <Th>{issue.autor}</Th>
                      <Th>
                        <Box maxW={100} whiteSpace="nowrap">
                          <Text overflow="hidden" textOverflow="ellipsis">
                            {issue.description}
                          </Text>
                        </Box>
                      </Th>
                      <Th>
                        <BadgesColored title={issue.priority} />
                      </Th>
                      <Th>{moment(new Date(issue.createdAt)).calendar()}</Th>
                      <Th>
                        <BadgesColored title={issue.status} />
                      </Th>
                      <Th>
                        <ActionsButtons issue={issue} />
                      </Th>
                    </Tr>
                  ))
                : null}
            </Tbody>
          </Table>
        </TableContainer>
        <Flex
          background="gray.100"
          justifyContent="space-around"
          alignItems="center"
        >
          <Flex>
            <Button onClick={() => setIndexPage(0)} disabled={indexPage === 0}>
              {"<<"}
            </Button>{" "}
            <Button
              onClick={() => setIndexPage(indexPage - 1)}
              disabled={indexPage === 0}
            >
              {"<"}
            </Button>{" "}
            <Button
              onClick={() => setIndexPage(indexPage + 1)}
              disabled={indexPage === pagination.length - 1}
            >
              {">"}
            </Button>{" "}
            <Button
              onClick={() => setIndexPage(pagination.length - 1)}
              disabled={indexPage === pagination.length - 1}
            >
              {">>"}
            </Button>
          </Flex>
          <Flex>
            <chakra.span>
              Página{" "}
              <Text as="strong">
                {indexPage + 1} de {NP.round(pagination.length, 0)}
              </Text>{" "}
            </chakra.span>
          </Flex>
          <Flex alignItems="center">
            <Text marginRight={3}>Mostrando:</Text>
            <Select
              value={take}
              onChange={(e: any) => {
                setTake(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </Select>
          </Flex>
        </Flex>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Criar Issue</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form noValidate onSubmit={handleSubmit}>
              <Stack spacing={5}>
                <FormControl
                  isRequired
                  isInvalid={touched.issue && Boolean(errors.issue)}
                >
                  <FormLabel
                    htmlFor="issue"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="normal"
                  >
                    Titulo
                  </FormLabel>
                  <Input
                    id="issue"
                    variant="filled"
                    type="text"
                    value={values.issue}
                    onChange={handleChange}
                  />
                  <FormErrorMessage ms="4px">
                    {touched.issue && errors.issue}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={touched.version && Boolean(errors.version)}
                >
                  <FormLabel
                    htmlFor="version"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="normal"
                  >
                    Versão
                  </FormLabel>
                  <Input
                    id="version"
                    variant="filled"
                    type="text"
                    value={values.version}
                    onChange={handleChange}
                  />
                  <FormErrorMessage ms="4px">
                    {touched.version && errors.version}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={touched.description && Boolean(errors.description)}
                >
                  <FormLabel
                    htmlFor="description"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="normal"
                  >
                    Descrição
                  </FormLabel>
                  <Input
                    id="description"
                    placeholder="Descrição"
                    variant="filled"
                    type="text"
                    value={values.description}
                    onChange={handleChange}
                  />
                  <FormErrorMessage ms="4px">
                    {touched.description && errors.description}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={touched.priority && Boolean(errors.priority)}
                >
                  <FormLabel
                    htmlFor="priority"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="normal"
                  >
                    Prioridade
                  </FormLabel>
                  <Select
                    value={values.priority}
                    onChange={handleChange}
                    id="priority"
                  >
                    {Object.keys(Priority).map((value) => (
                      <option value={value} key={value}>
                        {value}
                      </option>
                    ))}
                  </Select>
                  <FormErrorMessage ms="4px">
                    {touched.priority && errors.priority}
                  </FormErrorMessage>
                </FormControl>
                <Button type="submit" colorScheme="teal">
                  Salvar
                </Button>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
