import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '@/constants/roles';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  role: UserRole | null;
  modules: string[];
  isSuperAdmin: boolean;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: { name: string }[];
  } | null;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setRole: (role: UserRole | null) => void;
  setModules: (modules: string[]) => void;
  setSuperAdmin: (isSuperAdmin: boolean) => void;
  setUser: (user: AuthState['user']) => void;
  setAuth: (token: string, refreshToken: string, user: AuthState['user']) => void;
  clearToken: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      role: null,
      modules: [],
      isSuperAdmin: false,
      user: null,
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setRole: (role) => set({ role }),
      setModules: (modules) => set({ modules }),
      setSuperAdmin: (isSuperAdmin) => set({ isSuperAdmin }),
      setUser: (user) => set({ user }),
      setAuth: (token, refreshToken, user) =>
        set({
          token,
          refreshToken,
          user,
          role: null,
          modules: [],
          isSuperAdmin: false,
        }),
      clearToken: () => set({ token: null }),
      clearAuth: () =>
        set({
          token: null,
          refreshToken: null,
          user: null,
          role: null,
          modules: [],
          isSuperAdmin: false,
        }),
    }),
    {
      name: 'auth-token',
    }
  )
);
