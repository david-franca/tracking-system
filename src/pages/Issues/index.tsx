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
  Tooltip,
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
import TextFilter from "./components/TextFilter";
import DateFilter from "./components/DateFilter";
import CreateIssueModal from "./components/CreateIssueModal";

moment.locale("pt-br");

export const Issues = () => {
  const { signed, logout, payload, createIssue, deleteIssues } = useAuth();
  const [take, setTake] = useState(10);
  const [tableValues, setTableValues] = useState<Issue[]>([]);
  const [pagination, setPagination] = useState<Issue[][]>([]);
  const [indexPage, setIndexPage] = useState(0);
  const [idsChecked, setIdsChecked] = useState<number[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filterValue, setFilterValue] = useState("");
  const [filterKey, setFilterKey] = useState("");

  const navigate = useNavigate();

  const { data: issues } = useAxios<Issue[], AxiosError>(
    "issues",
    payload.token
  );

  const { items, requestSort, sortConfig } = useSortableData(issues ?? []);

  const handleFilterValue = (value: string) => {
    setFilterValue(value);
  };

  const handleFilterKey = (value: string) => {
    setFilterKey(value);
  };

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
      let i = [...items];

      if (filterValue) {
        const res = i.filter((issue) => {
          if (filterKey === "id" && Number(filterValue) === issue.id) {
            return issue;
          }
          if (
            filterKey !== "id" &&
            (issue as any)[filterKey].toLowerCase().startsWith(filterValue)
          ) {
            return issue;
          }
        });
        i = [...res];
      }

      const result = new Array(Math.ceil(i.length / take))
        .fill(i)
        .map((_) => i.splice(0, take));
      setPagination(result);

      setTableValues(result[indexPage]);
    }
  }, [take, items, indexPage, filterValue, filterKey]);

  useEffect(() => {
    if (!signed) {
      navigate("/");
    }
  }, [signed]);

  const columns = useMemo(
    () => [
      { label: "ID", accessor: "id", Filter: TextFilter },
      { label: "Problema", accessor: "issue", Filter: TextFilter },
      { label: "Versão", accessor: "version", Filter: TextFilter },
      { label: "Autor", accessor: "autor", Filter: TextFilter },
      { label: "Descrição", accessor: "description", Filter: TextFilter },
      { label: "Prioridade", accessor: "priority", Filter: TextFilter },
      { label: "Data", accessor: "createdAt", Filter: DateFilter },
      { label: "Status", accessor: "status", Filter: TextFilter },
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
              <Button
                onClick={() => deleteIssues(...idsChecked)}
                colorScheme="red"
              >
                Deletar Issues
              </Button>
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
              issues={items}
              handleFilterValue={handleFilterValue}
              filterValue={filterValue}
              handleFilterKey={handleFilterKey}
            />
            <Tbody>
              {tableValues
                ? tableValues.map((issue: Issue) => (
                    <Tr key={issue.id}>
                      <Th hidden={payload.role !== "MASTER"}>
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
                        <Tooltip label={issue.description}>
                          <Box maxW={150} whiteSpace="nowrap">
                            <Text overflow="hidden" textOverflow="ellipsis">
                              {issue.description}
                            </Text>
                          </Box>
                        </Tooltip>
                      </Th>
                      <Th>
                        <BadgesColored title={issue.priority} />
                      </Th>
                      <Th>{issue.createdAt}</Th>
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
      <CreateIssueModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};
