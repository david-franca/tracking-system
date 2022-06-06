import { AxiosError } from "axios";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { useToast } from "@chakra-ui/react";

import { Issue, Priority, Status, User } from "../@types";
import { api } from "../utils/api";
import { useAxios } from "./useAxios";
import { useLocalStorage } from "./useLocalStorage";

export interface IssueInput {
  version: string;
  issue: string;
  autor: string;
  priority: Priority;
  description: string;
}

type IssueInputUpdate = Partial<IssueInput>;

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextData {
  payload: User;
  createIssue: (issueInput: IssueInput) => Promise<Issue>;
  deleteIssue: (...ids: number[]) => void;
  updateIssue: (id: number, issue: IssueInputUpdate) => Promise<Issue>;
  logout: () => void;
  login: (username: string, password: string) => Promise<void>;
  signed: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  //const [issues, setIssues] = useState<Issue[]>([]);
  const [payload, setPayload] = useLocalStorage<User>("userJWT", {} as User);
  const navigate = useNavigate();
  const toast = useToast();
  

  /* useEffect(() => {
    console.log(error);
    if (error instanceof AxiosError && error.response?.status === 401) {
      toast({
        title: "Sessão Expirada",
        description: "Faça login novamente para continuar",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }
    navigate("/");
  }, [error]); */

  const login = async (username: string, password: string) => {
    const { data } = await api.post<User>("/auth/log-in", {
      username,
      password,
    });
    setPayload(data);
    toast({
      title: "Login efetuado com sucesso.",
      description: "Redirecionando",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    navigate("/issues");
  };

  const createIssue = async (issueInput: IssueInput) => {
    const { data } = await api.post<Issue>("/issues", issueInput, {
      headers: { "x-access-token": payload.token },
    });
    return data;
  };

  const deleteIssue = async (...ids: number[]) => {
    ids.forEach(async (id) => {
      await api.delete(`/issues/${id}`, {
        headers: { "x-access-token": payload.token },
      });
    });
  };

  const updateIssue = async (id: number, issue: IssueInputUpdate) => {
    console.log(id, issue);
    const response = await api.patch<Issue>(`/issues/${id}`, issue, {
      headers: { "x-access-token": payload.token },
    });
    return response.data;
  };

  const logout = () => {
    setPayload({} as User);
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{
        payload,
        createIssue,
        deleteIssue,
        updateIssue,
        logout,
        login,
        signed: !(Object.keys(payload).length === 0),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
