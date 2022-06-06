import { SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Popover,
  PopoverTrigger,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Issue } from "../../../@types";
import { useAuth } from "../../../hooks/useAuth";
import { TextFilter, TextFilterProps } from "./TextFilter";

interface ColumnsProps {
  label: string;
  accessor: string;
  Filter: ({ filterValue, handleFilterValue }: TextFilterProps) => JSX.Element;
}

interface TableHeadProps {
  columns: ColumnsProps[];
  requestSort: (key: string) => void;
  getClassNamesFor: (name: string) => JSX.Element | undefined;
  issues: Issue[];
  handleFilterValue: (value: string) => void;
  filterValue: string;
  handleFilterKey: (value: string) => void;
}

const TableHead = ({
  columns,
  requestSort,
  getClassNamesFor,
  issues,
  filterValue,
  handleFilterValue,
  handleFilterKey,
}: TableHeadProps) => {
  const { payload } = useAuth();
  return (
    <Thead>
      <Tr>
        <Th hidden={payload.role !== "MASTER"}></Th>
        {columns.map(({ label, accessor, Filter }) => {
          return (
            <Th key={accessor}>
              <Button
                rightIcon={getClassNamesFor(accessor)}
                onClick={() => requestSort(accessor)}
                variant="ghost"
              >
                {label}
              </Button>
              <Popover>
                <PopoverTrigger>
                  <IconButton
                    ml={2}
                    icon={<SearchIcon />}
                    aria-label={`search-${accessor}`}
                    onClick={() => {
                      handleFilterValue("");
                      handleFilterKey(accessor);
                    }}
                  />
                </PopoverTrigger>
                <Filter
                  filterValue={filterValue}
                  handleFilterValue={handleFilterValue}
                />
              </Popover>
            </Th>
          );
        })}
        <Th></Th>
      </Tr>
    </Thead>
  );
};

export default TableHead;
