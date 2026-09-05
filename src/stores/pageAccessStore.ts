"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  DEFAULT_PAGE_ACCESS,
  type PageAccessKey,
} from "@/constants/pages";

type PageAccessState = {
  access: Record<PageAccessKey, boolean>;
  setAccess: (key: PageAccessKey, enabled: boolean) => void;
  setManyAccess: (patch: Record<PageAccessKey, boolean>) => void;
  resetAccess: () => void;
};

export const usePageAccessStore = create<PageAccessState>()(
  persist(
    (set) => ({
      access: DEFAULT_PAGE_ACCESS,
      setAccess: (key, enabled) =>
        set((state) => ({
          access: { ...state.access, [key]: enabled },
        })),
      setManyAccess: (patch) =>
        set((state) => ({ access: { ...state.access, ...patch } })),
      resetAccess: () => set({ access: DEFAULT_PAGE_ACCESS }),
    }),
    {
      name: "xmerge_page_access",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
