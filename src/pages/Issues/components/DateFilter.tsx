import "react-datepicker/dist/react-datepicker.css";

import ptBR from "date-fns/locale/pt-BR";
import * as moment from "moment";
import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";

import {
  Input,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  Portal,
} from "@chakra-ui/react";

import { TextFilterProps } from "./TextFilter";

registerLocale("pt-BR", ptBR);

const DateFilter = ({ filterValue, handleFilterValue }: TextFilterProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  return (
    <Portal>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <DatePicker
            locale="pt-BR"
            dateFormat="dd/MM/yyyy"
            selected={startDate}
            onChange={(date: Date) => {
              setStartDate(date);
              handleFilterValue
                ? handleFilterValue(moment(date).format("DD/MM/YYYY"))
                : null;
            }}
          />
        </PopoverBody>
      </PopoverContent>
    </Portal>
  );
};

export default DateFilter;
