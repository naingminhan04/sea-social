export interface User {
  id: string;
  name: string;
  username: string;
  nickname: string | null;
  bio: string | null;
  points: number;
  profilePicId: string | null;
  coverPicId: string | null;
  email: string;
  phone: string | null;
  role: "USER" | "ADMIN";
  isVerified: boolean;
  verificationCodeExpiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  profilePic: string | null;
}

