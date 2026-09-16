import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '@/constants/roles';
import { useCompanyStore } from '@/stores/companyStore';
import { useCvStore } from '@/stores/useCvStore';

let storeHydrated = false;

export { storeHydrated };

export interface TenantSubscription {
  status: 'active' | 'inactive' | 'trial';
  plan: string | null;
  paidUntil: string | null;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  role: UserRole | null;
  modules: string[];
  lastUserId: string | null;
  lastTenantId: string | null;
  profileType: string | null;
  companyComplete: boolean;
  subscription: TenantSubscription | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    tenantId?: string;
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
  setCompanyComplete: (companyComplete: boolean) => void;
  setSubscription: (subscription: TenantSubscription | null) => void;
  setUser: (user: AuthState['user']) => void;
  setAuth: (
    token: string,
    refreshToken: string,
    user: AuthState['user'],
    subscription?: TenantSubscription | null
  ) => void;
  restoreAuth: (
    token: string,
    refreshToken: string,
    user: AuthState['user'],
    subscription?: TenantSubscription | null
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
      lastTenantId: null,
      profileType: null,
      companyComplete: true,
      subscription: null,
      user: null,
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setRole: (role) => set({ role }),
      setModules: (modules) => set({ modules }),
      setProfileType: (profileType) => set({ profileType }),
      setCompanyComplete: (companyComplete) => set({ companyComplete }),
      setSubscription: (subscription) => set({ subscription }),
      setUser: (user) =>
        set((state) => ({
          user,
          lastUserId: user?.id ?? state.lastUserId,
          lastTenantId: user?.tenantId ?? state.lastTenantId,
        })),
      setAuth: (token, refreshToken, user, subscription) =>
        set((state) => {
          const userId = user?.id ?? null;
          const tenantId = user?.tenantId ?? null;
          const sameUser = userId != null && userId === state.lastUserId;
          const sameTenant =
            tenantId != null && tenantId === state.lastTenantId;

          if (userId != null && tenantId != null && !sameTenant) {
            useCompanyStore.getState().resetCompany();
            useCvStore.getState().clearDraft();
          }

          return {
            token,
            refreshToken,
            user,
            lastUserId: userId,
            lastTenantId: tenantId,
            role: sameUser && sameTenant ? state.role : null,
            modules: sameUser && sameTenant ? state.modules : [],
            profileType: sameUser && sameTenant ? state.profileType : null,
            companyComplete:
              sameUser && sameTenant ? state.companyComplete : false,
            subscription:
              subscription ??
              (sameUser && sameTenant ? state.subscription : null),
          };
        }),
      clearToken: () => set({ token: null }),
      restoreAuth: (token, refreshToken, user, subscription) =>
        set((state) => ({
          token,
          refreshToken,
          user,
          lastUserId: user?.id ?? state.lastUserId,
          lastTenantId: user?.tenantId ?? state.lastTenantId,
          role: state.role,
          modules: state.modules,
          profileType: state.profileType,
          companyComplete: state.companyComplete,
          subscription: subscription ?? state.subscription,
        })),
      clearAuth: () =>
        set((state) => ({
          token: null,
          refreshToken: null,
          user: null,
          lastUserId: state.user?.id ?? null,
          lastTenantId: state.user?.tenantId ?? null,
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
