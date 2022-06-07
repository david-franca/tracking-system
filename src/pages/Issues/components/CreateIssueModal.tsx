import * as Yup from "yup";
import { ptForm } from "yup-locale-pt";

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
} from "@chakra-ui/react";

import { Issue, Priority } from "../../../@types";
import { useFormik } from "formik";
import { IssueInput, useAuth } from "../../../hooks/useAuth";

Yup.setLocale(ptForm);

interface CreateIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  createIssue: (issueInput: IssueInput) => Promise<void>;
}

const CreateIssueModal = ({
  isOpen,
  onClose,
  createIssue,
}: CreateIssueModalProps) => {
  const formSchema = Yup.object().shape({
    issue: Yup.string().required().min(2),
    version: Yup.string().required().min(2),
    description: Yup.string().required().min(2).max(200),
  });

  const { payload } = useAuth();

  const { handleSubmit, values, handleChange, touched, errors, resetForm } =
    useFormik({
      initialValues: {
        issue: "",
        version: "",
        description: "",
        priority: Priority.NORMAL,
        autor: payload.username,
      },
      validationSchema: formSchema,
      onSubmit: async (values) => {
        await createIssue(values);
        resetForm();
        onClose();
      },
    });
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Criar Issue</ModalHeader>
        <ModalCloseButton onClick={() => resetForm()} />
        <ModalBody>
          <form noValidate onSubmit={handleSubmit}>
            <Stack spacing={5}>
              <FormControl
                isRequired
                isInvalid={touched.issue && Boolean(errors.issue)}
              >
                <FormLabel
                  htmlFor="issue"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="normal"
                >
                  Titulo
                </FormLabel>
                <Input
                  id="issue"
                  variant="filled"
                  type="text"
                  value={values.issue}
                  onChange={handleChange}
                />
                <FormErrorMessage ms="4px">
                  {touched.issue && errors.issue}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={touched.version && Boolean(errors.version)}
              >
                <FormLabel
                  htmlFor="version"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="normal"
                >
                  Versão
                </FormLabel>
                <Input
                  id="version"
                  variant="filled"
                  type="text"
                  value={values.version}
                  onChange={handleChange}
                />
                <FormErrorMessage ms="4px">
                  {touched.version && errors.version}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={touched.description && Boolean(errors.description)}
              >
                <FormLabel
                  htmlFor="description"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="normal"
                >
                  Descrição
                </FormLabel>
                <Input
                  id="description"
                  placeholder="Descrição"
                  variant="filled"
                  type="text"
                  value={values.description}
                  onChange={handleChange}
                />
                <FormErrorMessage ms="4px">
                  {touched.description && errors.description}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={touched.priority && Boolean(errors.priority)}
              >
                <FormLabel
                  htmlFor="priority"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="normal"
                >
                  Prioridade
                </FormLabel>
                <Select
                  value={values.priority}
                  onChange={handleChange}
                  id="priority"
                >
                  {Object.keys(Priority).map((value) => (
                    <option value={value} key={value}>
                      {value}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage ms="4px">
                  {touched.priority && errors.priority}
                </FormErrorMessage>
              </FormControl>
              <Button type="submit" colorScheme="teal">
                Salvar
              </Button>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateIssueModal;
