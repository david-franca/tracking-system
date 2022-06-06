import { SearchIcon } from "@chakra-ui/icons";
import { Button, IconButton, Th, Thead, Tr } from "@chakra-ui/react";

interface ColumnsProps {
  label: string;
  accessor: string;
  sortable: boolean;
}

interface TableHeadProps {
  columns: ColumnsProps[];
  requestSort: (key: string) => void;
  getClassNamesFor: (name: string) => JSX.Element | undefined;
}

const TableHead = ({
  columns,
  requestSort,
  getClassNamesFor,
}: TableHeadProps) => {
  return (
    <Thead>
      <Tr>
        <Th></Th>
        {columns.map(({ label, accessor }) => {
          return (
            <Th key={accessor}>
              <Button
                rightIcon={getClassNamesFor(accessor)}
                onClick={() => requestSort(accessor)}
                variant="ghost"
              >
                {label}
              </Button>
              <IconButton
                ml={2}
                icon={<SearchIcon />}
                aria-label={`search-${accessor}`}
              />
            </Th>
          );
        })}
        <Th></Th>
      </Tr>
    </Thead>
  );
};

export default TableHead;
