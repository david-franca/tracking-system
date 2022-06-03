export enum Role {
  MASTER = "MASTER",
  DEVELOPER = "DEVELOPER",
  TESTER = "TESTER",
}

export enum Priority {
  BAIXA = "BAIXA",
  ALTA = "ALTA",
  NORMAL = "NORMAL",
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
