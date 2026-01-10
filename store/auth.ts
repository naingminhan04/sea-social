import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserType } from "@/types/user";

interface AuthState {
  tmpVerificationCode: string | null;
  user: UserType | null;
  setTmpVerificationCode: (code: string | null) => void;
  setUser: (user: UserType | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      tmpVerificationCode: null,
      user: null,

      setTmpVerificationCode: (tmpVerificationCode) =>
        set({ tmpVerificationCode }),

      setUser: (user) => set({ user }),

      logout: () => set({ user: null }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
