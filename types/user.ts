import { Metadata } from "./post";

export interface UserResponseType {
  metadata: Metadata;
  users: UserType[];
}

export interface UserType {
  id: string;
  email: string;
  name: string;
  username: string;
  profilePic: string | null;
  bio: string | null;
  createdAt: string;
  role: "USER" | "ADMIN";
  postsCount: number;
  likesCount: number;
  coverPic: string | null;
}

export interface UniqueUsernameResponseType {
  message: string;
  isUnique: boolean;
}
