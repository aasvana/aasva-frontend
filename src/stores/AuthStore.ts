import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserRole } from '@/constants/roles';

interface AuthState {
  token: string | null;
  role: UserRole | null;
  setToken: (token: string | null) => void;
  setRole: (role: UserRole | null) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      setToken: (token) => set({ token }),
      setRole: (role) => set({ role }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: 'auth-token',
    }
  )
);
