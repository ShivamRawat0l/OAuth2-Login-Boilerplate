export type PSQLLogin = {
  id: number;
  email: string;
  password: string;
  refresh_token: string;
};

export type PSQLInfo = {
  severity: string;
  code: string;
  detail: string;
  rowCount: number;
};
