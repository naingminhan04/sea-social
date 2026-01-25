import { UserType } from "./user";

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginSuccessResponse = {
  user: UserType;
  verificationCode?: string;
};

export type VerifySuccessResponse = {
  user: UserType;
};