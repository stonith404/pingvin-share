type User = {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  totpVerified: boolean;
};

export type CreateUser = {
  username: string;
  email: string;
  password: string;
  isAdmin?: boolean;
};

export type UpdateUser = {
  username?: string;
  email?: string;
  password?: string;
  isAdmin?: boolean;
};

export type UpdateCurrentUser = {
  username?: string;
  email?: string;
};

export type CurrentUser = User & {};

export default User;
