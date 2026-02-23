import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserType } from "@/types/user";

interface AuthState {
  tmpVerificationCode: number | null;
  user: UserType | null;
  setTmpVerificationCode: (code: number | null) => void;
  setUser: (user: UserType | null) => void;
  logOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tmpVerificationCode: null,
      user: null,

      setTmpVerificationCode: (tmpVerificationCode) =>
        set({ tmpVerificationCode }),

      setUser: (user) => set({ user }),

      logOut: () => set({ user: null }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
