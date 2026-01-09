import { create } from "zustand";
import { UserType } from "@/types/user";

interface AuthState {
  tmpVerificationCode: string | null;
  user: UserType | null;
  setTmpVerificationCode: (tmpVerificationCode: string | null) => void;
  setUser: (user: UserType | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    (set) => ({
      tmpVerificationCode: null,
      user: null,
      setTmpVerificationCode: (tmpVerificationCode) => set({ tmpVerificationCode }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    })
);
