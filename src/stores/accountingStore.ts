"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createTenantStorage, registerTenantScopedStore } from "@/lib/tenant-storage";

export type AccountingDocType =
  | "estimate"
  | "credit-note"
  | "debit-note"
  | "receipt"
  | "expense";

export type AccountingEntry = {
  id: string;
  type: AccountingDocType;
  no: string;
  date: string;
  party: string;
  category?: string;
  amount: string;
  status: string;
  notes: string;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `acc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

type AccountingState = {
  entries: AccountingEntry[];
  addEntry: (data: Omit<AccountingEntry, "id">) => void;
  updateEntry: (id: string, data: Omit<AccountingEntry, "id">) => void;
  deleteEntry: (id: string) => void;
  resetEntries: () => void;
};

export const useAccountingStore = create<AccountingState>()(
  persist(
    (set) => ({
      entries: [],

      addEntry: (data) =>
        set((state) => ({
          entries: [...state.entries, { id: newId(), ...data }],
        })),

      updateEntry: (id, data) =>
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, ...data } : entry
          ),
        })),

      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        })),

      resetEntries: () => set({ entries: [] }),
    }),
    {
      name: "xmerge_accounting",
      storage: createJSONStorage(() => createTenantStorage()),
    }
  )
);

registerTenantScopedStore(() => {
  void useAccountingStore.persist.rehydrate();
});
