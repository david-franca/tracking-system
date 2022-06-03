import "react-datepicker/dist/react-datepicker.css";

import DatePicker from "react-datepicker";
import { Row } from "react-table";

import { SearchIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";

interface DefaultColumnFilterProps {
  column: {
    filterValue: any;
    preFilteredRows: Row<{}>[];
    setFilter: (updater: any) => void;
  };
}

export const DatePickerShow = ({
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
            <DatePicker
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
