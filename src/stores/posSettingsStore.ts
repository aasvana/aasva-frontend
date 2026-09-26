"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createTenantStorage, registerTenantScopedStore } from "@/lib/tenant-storage";

export type PosSettings = {
  lowStockThreshold: number;
  defaultLabelCopies: number;
};

export const POS_SETTINGS_DEFAULTS: PosSettings = {
  lowStockThreshold: 10,
  defaultLabelCopies: 1,
};

type PosSettingsState = {
  settings: PosSettings;
  updateSettings: (data: Partial<PosSettings>) => void;
  resetSettings: () => void;
};

export const usePosSettingsStore = create<PosSettingsState>()(
  persist(
    (set) => ({
      settings: POS_SETTINGS_DEFAULTS,
      updateSettings: (data) =>
        set((state) => ({ settings: { ...state.settings, ...data } })),
      resetSettings: () => set({ settings: POS_SETTINGS_DEFAULTS }),
    }),
    {
      name: "xmerge_pos_settings",
      storage: createJSONStorage(() => createTenantStorage()),
    }
  )
);

registerTenantScopedStore(() => {
  void usePosSettingsStore.persist.rehydrate();
});
