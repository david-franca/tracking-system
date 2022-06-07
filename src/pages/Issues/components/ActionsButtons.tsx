import { useFormik } from "formik";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import FocusLock from "react-focus-lock";

import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Radio,
  RadioGroup,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import { Issue, Priority, Status } from "../../../@types";
import { IssueInput, useAuth } from "../../../hooks/useAuth";
import { handleError } from "../../../utils/handleError";

type IssueEdit = Omit<Issue, "id" | "createdAt" | "userId" | "autor">;

interface FormProps {
  issue: Issue;
  firstFieldRef: MutableRefObject<any>;
  onCancel: () => void;
  onSave: (id: number, issue: Partial<IssueInput>) => Promise<Issue>;
}

const Form = ({ firstFieldRef, onCancel, issue, onSave }: FormProps) => {
  const toast = useToast();
  const [priorityValue, setPriorityValue] = useState<string>(issue.priority);
  const [statusValue, setStatusValue] = useState<string>(issue.status);
  const [loading, setLoading] = useState(false);
  const { payload } = useAuth();

  const formik = useFormik({
    initialValues: {
      priority: issue.priority,
      status: issue.status,
    },
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await onSave(issue.id, values);
        setLoading(false);
        toast({
          title: "Sucesso",
          description: "Os valores já foram alterados",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onCancel();
      } catch (error) {
        setLoading(false);
        const e = handleError(error);
        if (e) {
          if (typeof e === "string") {
            toast({
              title: "Error",
              description: e,
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          } else {
            e.forEach((err) => {
              toast({
                title: "Error",
                description: err,
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            });
          }
        }
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("priority", priorityValue);
    formik.setFieldValue("status", statusValue);
  }, [priorityValue, statusValue]);

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <Stack spacing={8}>
        <FormControl>
          <FormLabel htmlFor="priority">Prioridade</FormLabel>
          <RadioGroup
            ref={firstFieldRef}
            value={priorityValue}
            onChange={setPriorityValue}
          >
            <Stack spacing={3} direction="row">
              {Object.values(Priority).map((priority) => (
                <Radio value={priority} key={priority}>
                  {priority}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        </FormControl>

        <FormControl
          hidden={
            issue.id !== payload.id &&
            (issue.status === "APROVADO" || issue.status === "REPROVADO")
          }
        >
          <FormLabel htmlFor="status">Status</FormLabel>
          <RadioGroup value={statusValue} onChange={setStatusValue}>
            <Stack spacing={4}>
              {Object.values(Status).map((status) => (
                <Radio
                  hidden={
                    issue.userId !== payload.id &&
                    (status === "APROVADO" || status === "REPROVADO")
                  }
                  isDisabled={
                    issue.userId === payload.id &&
                    (payload.role === "MASTER" || payload.role === "TESTER")
                      ? false
                      : ["APROVADO", "REPROVADO"].includes(status)
                      ? true
                      : false
                  }
                  value={status}
                  key={status}
                >
                  {status}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        </FormControl>
        <ButtonGroup display="flex" justifyContent="flex-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            isLoading={loading}
            loadingText="Salvando..."
            colorScheme="teal"
            type="submit"
          >
            Save
          </Button>
        </ButtonGroup>
      </Stack>
    </form>
  );
};

interface ActionsButtonsProps {
  issue: Issue;
  deleteIssue: (...ids: number[]) => void;
}

const ActionsButtons = ({ issue, deleteIssue }: ActionsButtonsProps) => {
  const { updateIssue, payload } = useAuth();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const firstFieldRef = useRef(null);
  const toast = useToast();

  return (
    <ButtonGroup size="sm" isAttached variant="solid">
      <Popover
        isOpen={isOpen}
        initialFocusRef={firstFieldRef}
        onOpen={onOpen}
        onClose={onClose}
        placement="right"
        closeOnBlur={false}
      >
        <PopoverTrigger>
          <IconButton
            colorScheme="whatsapp"
            aria-label="Edit issue"
            icon={<EditIcon />}
          />
        </PopoverTrigger>
        <PopoverContent p={5}>
          <FocusLock returnFocus persistentFocus={false}>
            <PopoverArrow />
            <PopoverCloseButton />
            <Form
              firstFieldRef={firstFieldRef}
              onCancel={onClose}
              issue={issue}
              onSave={updateIssue}
            />
          </FocusLock>
        </PopoverContent>
      </Popover>
      <Popover>
        {({ onClose: close }) => (
          <>
            <PopoverTrigger>
              <IconButton
                isDisabled={payload.role !== "MASTER"}
                colorScheme="red"
                aria-label="Delete issue"
                icon={<DeleteIcon />}
              />
            </PopoverTrigger>
            <Portal>
              <PopoverContent
                color="white"
                bg="blue.800"
                borderColor="blue.800"
              >
                <PopoverArrow bg="blue.800" />
                <PopoverCloseButton />
                <PopoverHeader pt={4} fontWeight="bold" border="0">
                  Deletar Linha?
                </PopoverHeader>
                <PopoverBody>
                  Essa é uma ação irreversível. Confirmar?
                </PopoverBody>
                <PopoverFooter
                  border="0"
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                  pb={4}
                >
                  <Button
                    isDisabled={payload.role !== "MASTER"}
                    isLoading={loading}
                    loadingText="Aguarde..."
                    colorScheme="red"
                    onClick={() => {
                      setLoading(true);
                      deleteIssue(issue.id);
                      setLoading(false);
                      close();
                    }}
                  >
                    Sim
                  </Button>
                </PopoverFooter>
              </PopoverContent>
            </Portal>
          </>
        )}
      </Popover>
    </ButtonGroup>
  );
};

export default ActionsButtons;
