// Type definitions for DB operations

export type CreateUserParams = {
  username: string;
  password: string;
};

export type UpdateUserParams = {
  username?: string;
  password?: string;
  email?: string;
};
