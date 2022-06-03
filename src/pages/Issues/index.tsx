import "react-datepicker/dist/react-datepicker.css";

import { useFormik } from "formik";
import { matchSorter } from "match-sorter";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Column,
  useFilters,
  useGlobalFilter,
  usePagination,
  useRowSelect,
  useSortBy,
  useTable,
} from "react-table";
import * as Yup from "yup";
import { ptForm } from "yup-locale-pt";

import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import {
  Badge,
  Button,
  chakra,
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
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../hooks/useAuth";
import ActiveButton from "./components/ActiveButton";
import { DatePickerShow } from "./components/Datepicker";
import { DefaultColumnFilter } from "./components/DefaultColumnFilter";

Yup.setLocale(ptForm);
export enum Priority {
  BAIXA = "BAIXA",
  ALTA = "ALTA",
  NORMAL = "NORMAL",
}

function fuzzyTextFilterFn(rows: any[], id: any, filterValue: any) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val: any) => !val;

export const Issues = () => {
  const navigate = useNavigate();

  const { signed, logout, payload, issues, createIssue } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      console.log(values);
      await createIssue(values);
      onClose();
    },
  });

  useEffect(() => {
    if (!signed) {
      navigate("/");
    }
  }, [signed]);

  const columns = useMemo<Column[]>(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Problema", accessor: "issue" },
      { Header: "Versão", accessor: "version" },
      { Header: "Autor do Registro ", accessor: "autor" },
      { Header: "Descrição", accessor: "description" },
      { Header: "Prioridade", accessor: "priority" },
      { Header: "Data", accessor: "createdAt", Filter: DatePickerShow },
      { Header: "Status", accessor: "status" },
    ],
    []
  );
  const dataCollumns = useMemo(() => issues ?? [], [issues]);
  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );
  const filterTypes = useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows: any[], id: any, filterValue: any) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
  } = useTable(
    {
      columns,
      data: dataCollumns,
      initialState: { pageIndex: 0 },
      defaultColumn,
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  return (
    <Flex height="100vh" justifyContent="center" background="gray.500">
      <Flex direction="column" p={12} rounded={6}>
        <Flex justifyContent="space-between">
          <Heading mb={6} color="white">
            Issue Tracking System
          </Heading>
          <ActiveButton createIssue={onOpen} logout={logout} />
        </Flex>
        <Table background="gray.100" {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                {headerGroup.headers.map((column) => (
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={column.id}
                  >
                    <Flex alignItems="center" justifyContent="flex-start">
                      <Flex>{column.render("Header")}</Flex>
                      <Flex>
                        {column.canFilter ? column.render("Filter") : null}
                      </Flex>
                      <Flex>
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <TriangleDownIcon aria-label="sorted descending" />
                          ) : (
                            <TriangleUpIcon aria-label="sorted ascending" />
                          )
                        ) : null}
                      </Flex>
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()} key={row.id}>
                  {row.cells.map((cell, index) => (
                    <Td {...cell.getCellProps()} key={index}>
                      {cell.render("Cell")}
                    </Td>
                  ))}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <Flex
          background="gray.100"
          justifyContent="space-around"
          alignItems="center"
        >
          <Flex>
            <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {"<<"}
            </Button>{" "}
            <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {"<"}
            </Button>{" "}
            <Button onClick={() => nextPage()} disabled={!canNextPage}>
              {">"}
            </Button>{" "}
            <Button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              {">>"}
            </Button>
          </Flex>
          <Flex>
            <chakra.span>
              Página{" "}
              <Text as="strong">
                {state.pageIndex + 1} de {pageOptions.length}
              </Text>{" "}
            </chakra.span>
          </Flex>
          <Flex alignItems="center" justifyContent="space-around">
            <Text>Vá para a página:</Text>
            <Input
              type="number"
              w="60%"
              defaultValue={state.pageIndex + 1}
              onChange={(e: any) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
            />
          </Flex>
          <Flex alignItems="center">
            <Text marginRight={3}>Mostrando:</Text>
            <Select
              value={state.pageSize}
              onChange={(e: any) => {
                setPageSize(Number(e.target.value));
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
