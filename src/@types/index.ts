export enum Role {
  MASTER = "MASTER",
  DEVELOPER = "DEVELOPER",
  TESTER = "TESTER",
}

export enum Priority {
  BAIXA = "BAIXA",
  NORMAL = "NORMAL",
  ALTA = "ALTA",
}

export enum Status {
  APROVADO = "APROVADO",
  REPROVADO = "REPROVADO",
  NAO_SERA_REMOVIDO = "NAO_SERA_REMOVIDO",
  DUPLICADO = "DUPLICADO",
  NAO_E_ERRO = "NAO_E_ERRO",
  RESOLVIDO = "RESOLVIDO",
  NOVO = "NOVO",
}

export interface User {
  id: number;
  username: string;
  role: Role;
  token: string;
}

export interface Issue {
  id: number;
  version: string;
  issue: string;
  autor: string;
  priority: Priority;
  createdAt: string;
  description: string;
  status: Status;
  userId: number;
}

export type Enumerable<T> = T | Array<T>;

interface IssueWhereInput {
  AND?: Enumerable<IssueWhereInput>;
  OR?: Enumerable<IssueWhereInput>;
  NOT?: Enumerable<IssueWhereInput>;
  id?: number;
  version?: string;
  issue?: string;
  autor?: string;
  priority?: Priority;
  createdAt?: string;
  description?: string;
  status?: Status;
  userId?: number;
}

export type SortOrder = "asc" | "desc";

export type IssueOrderByWithRelationInput = {
  id?: SortOrder;
  version?: SortOrder;
  issue?: SortOrder;
  autor?: SortOrder;
  priority?: SortOrder;
  createdAt?: SortOrder;
  description?: SortOrder;
  status?: SortOrder;
  userId?: SortOrder;
};

export interface Params {
  take?: number;
  skip?: number;
  cursor?: { id?: number };
  where?: IssueWhereInput;
  orderBy?: IssueOrderByWithRelationInput;
}

export interface IssueInput {
  version: string;
  issue: string;
  autor: string;
  priority: Priority;
  description: string;
}

export type IssueInputUpdate = Partial<IssueInput>;
