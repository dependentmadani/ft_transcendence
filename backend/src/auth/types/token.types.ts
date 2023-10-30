export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type CheckUser = {
  token: Tokens;
  state: boolean;
};
