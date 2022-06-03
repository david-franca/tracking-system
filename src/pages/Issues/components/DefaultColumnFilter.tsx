import { SearchIcon } from "@chakra-ui/icons";
import {
  Popover,
  PopoverTrigger,
  IconButton,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Input,
} from "@chakra-ui/react";
import { Row } from "react-table";

interface DefaultColumnFilterProps {
  column: {
    filterValue: any;
    preFilteredRows: Row<{}>[];
    setFilter: (updater: any) => void;
  };
}

export const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}: DefaultColumnFilterProps): JSX.Element => {
  return (
    <Popover>
      <PopoverTrigger>
        <IconButton aria-label="Search database" icon={<SearchIcon />} />
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <Input
              value={filterValue || ""}
              onChange={(e: any) => {
                setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
              }}
            />
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};
