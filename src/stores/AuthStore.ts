import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '@/constants/roles';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  role: UserRole | null;
  modules: string[];
  isSuperAdmin: boolean;
  lastUserId: string | null;
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
  restoreAuth: (
    token: string,
    refreshToken: string,
    user: AuthState['user']
  ) => void;
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
      lastUserId: null,
      user: null,
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setRole: (role) => set({ role }),
      setModules: (modules) => set({ modules }),
      setSuperAdmin: (isSuperAdmin) => set({ isSuperAdmin }),
      setUser: (user) =>
        set((state) => ({
          user,
          lastUserId: user?.id ?? state.lastUserId,
        })),
      setAuth: (token, refreshToken, user) =>
        set((state) => {
          const userId = user?.id ?? null;
          const sameUser = userId != null && userId === state.lastUserId;
          return {
            token,
            refreshToken,
            user,
            lastUserId: userId,
            role: sameUser ? state.role : null,
            modules: sameUser ? state.modules : [],
            isSuperAdmin: sameUser ? state.isSuperAdmin : false,
          };
        }),
      clearToken: () => set({ token: null }),
      restoreAuth: (token, refreshToken, user) =>
        set((state) => ({
          token,
          refreshToken,
          user,
          lastUserId: user?.id ?? state.lastUserId,
          role: state.role,
          modules: state.modules,
          isSuperAdmin: state.isSuperAdmin,
        })),
      clearAuth: () =>
        set((state) => ({
          token: null,
          refreshToken: null,
          user: null,
          lastUserId: state.user?.id ?? null,
        })),
    }),
    {
      name: 'auth-token',
    }
  )
);
