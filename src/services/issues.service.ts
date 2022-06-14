import { Issue, IssueInput, User } from "../@types";
import { api } from "../utils/api";

type IssueInputUpdate = Partial<IssueInput>;

const userJWT = localStorage.getItem("userJWT");

let user: User | null = null;
if (userJWT) {
  user = JSON.parse(userJWT);
}

const createIssue = async (issueInput: IssueInput) => {
  const { data } = await api.post<Issue>("/issues", issueInput, {
    headers: { "x-access-token": user?.token ?? "" },
  });
  return data;
};

const deleteIssue = async (id: number) => {
  await api.delete(`/issues/${id}`, {
    headers: { "x-access-token": user?.token ?? "" },
  });
};

const updateIssue = async (id: number, issue: IssueInputUpdate) => {
  const { data } = await api.patch<Issue>(`/issues/${id}`, issue, {
    headers: { "x-access-token": user?.token ?? "" },
  });
  return data;
};

const issuesService = {
  createIssue,
  updateIssue,
  deleteIssue,
};

export default issuesService;
