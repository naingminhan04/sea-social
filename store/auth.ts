import { create } from "zustand";

interface AuthState {
  user: null | { email: string; token: string };
  setUser: (user: { email: string; token: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
