import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/user";

interface AuthState {
  tmpVerificationCode: string | null;
  user: User | null;
  setTmpVerificationCode: (tmpVerificationCode: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tmpVerificationCode: null,
      user: null,
      setTmpVerificationCode: (tmpVerificationCode) => set({ tmpVerificationCode }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "user",
    }
  )
);
