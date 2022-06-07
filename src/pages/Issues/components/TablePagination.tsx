import { Flex, Button, chakra, Select, Text } from "@chakra-ui/react";
import NP from "number-precision";

interface TablePaginationProps {
  handleIndex: (value: number) => void;
  indexPage: number;
  pagination: number;
  handleTake: (value: number) => void;
  take: number;
}

const TablePagination = ({
  handleIndex,
  indexPage,
  pagination,
  handleTake,
  take,
}: TablePaginationProps) => {
  return (
    <Flex
      background="gray.100"
      justifyContent="space-around"
      alignItems="center"
    >
      <Flex>
        <Button onClick={() => handleIndex(0)} disabled={indexPage === 0}>
          {"<<"}
        </Button>{" "}
        <Button
          onClick={() => handleIndex(indexPage - 1)}
          disabled={indexPage === 0}
        >
          {"<"}
        </Button>{" "}
        <Button
          onClick={() => handleIndex(indexPage + 1)}
          disabled={indexPage === pagination - 1}
        >
          {">"}
        </Button>{" "}
        <Button
          onClick={() => handleIndex(pagination - 1)}
          disabled={indexPage === pagination - 1}
        >
          {">>"}
        </Button>
      </Flex>
      <Flex>
        <chakra.span>
          Página{" "}
          <Text as="strong">
            {indexPage + 1} de {NP.round(pagination, 0)}
          </Text>{" "}
        </chakra.span>
      </Flex>
      <Flex alignItems="center">
        <Text marginRight={3}>Mostrando:</Text>
        <Select
          value={take}
          onChange={(e: any) => {
            handleTake(Number(e.target.value));
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
  );
};

export default TablePagination;
