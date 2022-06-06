import {
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Input,
} from "@chakra-ui/react";

export interface TextFilterProps {
  handleFilterValue?: (value: string) => void;
  filterValue?: string;
}

export const TextFilter = ({
  filterValue,
  handleFilterValue,
}: TextFilterProps) => {
  return (
    <Portal>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>
          <Input
            onChange={(e: any) =>
              handleFilterValue ? handleFilterValue(e.target.value) : null
            }
            value={filterValue}
          />
        </PopoverBody>
      </PopoverContent>
    </Portal>
  );
};
