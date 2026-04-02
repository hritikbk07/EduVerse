import { create } from "zustand";

interface AuthState {
  user: any;
  setUser: (user: any) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "null")
    : null,

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
}));