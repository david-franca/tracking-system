import "react-datepicker/dist/react-datepicker.css";

import { AxiosError } from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";

import { TriangleDownIcon, TriangleUpIcon, UpDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  TableContainer,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { Issue, IssueInput } from "../../@types";
import { useAxios } from "../../hooks/useAxios";
import { useSortableData } from "../../hooks/useSortableData";
import { useAppDispatch, useAppSelector } from "../../hooks/useStore";
import { logout } from "../../redux/features/auth";
import IssuesService from "../../services/issues.service";
import { handleError } from "../../utils/handleError";
import ActiveButton from "./components/ActiveButton";
import CreateIssueModal from "./components/CreateIssueModal";
import DateFilter from "./components/DateFilter";
import TableBody from "./components/TableBody";
import TableHead from "./components/TableHead";
import TablePagination from "./components/TablePagination";
import TextFilter from "./components/TextFilter";

export const Issues = () => {
  const [take, setTake] = useState(10);
  const [tableValues, setTableValues] = useState<Issue[]>([]);
  const [pagination, setPagination] = useState<Issue[][]>([]);
  const [indexPage, setIndexPage] = useState(0);
  const [idsChecked, setIdsChecked] = useState<number[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [filterValue, setFilterValue] = useState("");
  const [filterKey, setFilterKey] = useState("");
  const toast = useToast();
  const { user: payload } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  if (!payload) {
    return <Navigate to="/" replace />;
  }

  const logOut = useCallback(() => {
    dispatch(logout);
  }, [dispatch]);

  const { data: issues } = useAxios<Issue[], AxiosError>(
    "issues",
    payload.token,
    { orderBy: { createdAt: "desc" } }
  );

  const { items, requestSort, sortConfig } = useSortableData(issues ?? []);

  const handleIndex = (value: number) => {
    setIndexPage(value);
  };

  const handleTake = (value: number) => {
    setTake(value);
  };

  const handleFilterValue = (value: string) => {
    setFilterValue(value);
  };

  const handleFilterKey = (value: string) => {
    setFilterKey(value);
  };

  const deleteIssues = async (...ids: number[]) => {
    ids.map(async (id) => {
      IssuesService.deleteIssue(id)
        .then(() => {
          const i = [...items];
          const index = i.findIndex((value) => value.id === id);
          i.splice(index, 1);

          const result = new Array(Math.ceil(i.length / take))
            .fill(i)
            .map((_) => i.splice(0, take));
          setPagination(result);

          setTableValues(result[indexPage]);
        })
        .catch((error) => {
          const e = handleError(error);
          if (typeof e === "string") {
            toast({
              title: "Erro",
              description: e,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        })
        .finally(() => {
          toast({
            title: "Sucesso",
            description: "As issues foram apagadas",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        });
      return;
    });
    ids.forEach((id) => {});
    setIdsChecked([]);
  };

  const create = async (values: IssueInput) => {
    try {
      const response = await IssuesService.createIssue(values);
      const i = [...items];
      i.push(response);

      const result = new Array(Math.ceil(i.length / take))
        .fill(i)
        .map((_) => i.splice(0, take));
      setPagination(result);

      setTableValues(result[indexPage]);
    } catch (error) {
      const e = handleError(error);
      if (typeof e === "string") {
        toast({
          title: "Erro",
          description: e,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
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

  const columns = useMemo(
    () => [
      { label: "ID", accessor: "id", Filter: TextFilter },
      { label: "Problema", accessor: "issue", Filter: TextFilter },
      { label: "Vers??o", accessor: "version", Filter: TextFilter },
      { label: "Autor", accessor: "autor", Filter: TextFilter },
      { label: "Descri????o", accessor: "description", Filter: TextFilter },
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
            <ActiveButton createIssue={onOpen} logout={logOut} />
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
            <TableBody
              handleChecked={handleChecked}
              idsChecked={idsChecked}
              tableValues={tableValues}
              deleteIssue={deleteIssues}
            />
          </Table>
        </TableContainer>
        <TablePagination
          handleIndex={handleIndex}
          indexPage={indexPage}
          pagination={pagination.length}
          handleTake={handleTake}
          take={take}
        />
      </Flex>
      <CreateIssueModal
        isOpen={isOpen}
        onClose={onClose}
        createIssue={create}
      />
    </Flex>
  );
};
