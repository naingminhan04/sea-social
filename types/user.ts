import { Metadata } from "./post";

export type LoginSuccessData = {
  user: UserType;
  verificationCode?: string;
};

export interface UserResponseType {
  metadata: Metadata;
  users: UserType[];
}

export interface UserType {
  id: string;
  name: string;
  username: string;
  nickname: string | null;
  bio: string | null;
  points: number;
  email: string;
  phone: string | null;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  profilePic: string | null;
  coverPic: string | null;
  accountStatus: AccountStatusType;
  _count: {
    posts: number,
    followers: number,
    followings: number,
    likes: number,
  }
}

enum AccountStatusType {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

