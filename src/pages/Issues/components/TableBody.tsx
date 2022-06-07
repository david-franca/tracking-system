import { ChangeEvent } from "react";

import { Box, Checkbox, Tbody, Text, Th, Tooltip, Tr } from "@chakra-ui/react";

import { Issue } from "../../../@types";
import ActionsButtons from "./ActionsButtons";
import BadgesColored from "./BadgesColored";
import { useAuth } from "../../../hooks/useAuth";

interface TableBodyProps {
  tableValues: Issue[];
  idsChecked: number[];
  handleChecked: (id: number, isChecked: boolean) => void;
  deleteIssue: (...ids: number[]) => void;
}

const TableBody = ({
  tableValues,
  idsChecked,
  handleChecked,
  deleteIssue,
}: TableBodyProps) => {
  const { payload } = useAuth();
  return (
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
                <ActionsButtons issue={issue} deleteIssue={deleteIssue} />
              </Th>
            </Tr>
          ))
        : null}
    </Tbody>
  );
};

export default TableBody;
