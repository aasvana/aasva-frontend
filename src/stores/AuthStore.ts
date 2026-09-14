import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '@/constants/roles';

let storeHydrated = false;

export { storeHydrated };

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  role: UserRole | null;
  modules: string[];
  lastUserId: string | null;
  profileType: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive?: boolean;
    isApproved?: boolean;
    roles: { name: string }[];
    profileType?: { id: string; name: string; key: string } | null;
    detail?: {
      id: string;
      userId: string;
      dateOfBirth: string | null;
      phone: string | null;
      address: string | null;
      details: Record<string, unknown> | null;
    } | null;
  } | null;
  setToken: (token: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  setRole: (role: UserRole | null) => void;
  setModules: (modules: string[]) => void;
  setProfileType: (profileType: string | null) => void;
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
      lastUserId: null,
      profileType: null,
      user: null,
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setRole: (role) => set({ role }),
      setModules: (modules) => set({ modules }),
      setProfileType: (profileType) => set({ profileType }),
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
            profileType: sameUser ? state.profileType : null,
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
          profileType: state.profileType,
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
      onRehydrateStorage: () => {
        storeHydrated = true;
      },
    }
  )
);
