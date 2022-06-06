import "react-datepicker/dist/react-datepicker.css";

import { useState } from "react";
import DatePicker from "react-datepicker";

import {
  Input,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  Portal,
} from "@chakra-ui/react";

const DateFilter = () => {
  const [startDate, setStartDate] = useState(new Date());
  return (
    <Portal>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <DatePicker
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
          />
        </PopoverBody>
      </PopoverContent>
    </Portal>
  );
};

export default DateFilter;
