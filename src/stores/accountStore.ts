"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createTenantStorage, registerTenantScopedStore } from "@/lib/tenant-storage";

export const ACCOUNT_KINDS = ["bank", "cash"] as const;

export type AccountKind = (typeof ACCOUNT_KINDS)[number];

export const ACCOUNT_STATUSES = ["Active", "Inactive"] as const;

export type Account = {
  id: string;
  name: string;
  kind: AccountKind;
  bankName: string;
  accountNo: string;
  currency: string;
  openingBalance: string;
  status: (typeof ACCOUNT_STATUSES)[number];
  description: string;
  createdAt: string;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `acc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const seedAccounts = (): Account[] => [
  {
    id: newId(),
    name: "Business Checking",
    kind: "bank",
    bankName: "First National Bank",
    accountNo: "•••• 4821",
    currency: "USD",
    openingBalance: "12500",
    status: "Active",
    description: "Primary operating account.",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId(),
    name: "Savings Reserve",
    kind: "bank",
    bankName: "First National Bank",
    accountNo: "•••• 9302",
    currency: "USD",
    openingBalance: "5000",
    status: "Active",
    description: "Emergency fund.",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId(),
    name: "Petty Cash",
    kind: "cash",
    bankName: "",
    accountNo: "",
    currency: "USD",
    openingBalance: "300",
    status: "Active",
    description: "Day-to-day cash float.",
    createdAt: new Date().toISOString(),
  },
];

type AccountState = {
  accounts: Account[];
  addAccount: (data: Omit<Account, "id" | "createdAt">) => void;
  updateAccount: (id: string, data: Omit<Account, "id" | "createdAt">) => void;
  deleteAccount: (id: string) => void;
  resetAccounts: () => void;
};

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      accounts: seedAccounts(),

      addAccount: (data) =>
        set((state) => ({
          accounts: [
            { id: newId(), createdAt: new Date().toISOString(), ...data },
            ...state.accounts,
          ],
        })),

      updateAccount: (id, data) =>
        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.id === id ? { ...account, ...data } : account
          ),
        })),

      deleteAccount: (id) =>
        set((state) => ({
          accounts: state.accounts.filter((account) => account.id !== id),
        })),

      resetAccounts: () => set({ accounts: seedAccounts() }),
    }),
    {
      name: "xmerge_accounts",
      storage: createJSONStorage(() => createTenantStorage()),
    }
  )
);

registerTenantScopedStore(() => {
  void useAccountStore.persist.rehydrate();
});
