"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const ACCOUNT_TYPES = [
  "asset",
  "liability",
  "equity",
  "income",
  "expense",
] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
  asset: "Asset",
  liability: "Liability",
  equity: "Equity",
  income: "Income",
  expense: "Expense",
};

export type CoaAccount = {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  openingBalance: string;
  status: "Active" | "Inactive";
  description: string;
  createdAt: string;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `coa_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const seedAccounts = (): CoaAccount[] => [
  { id: newId(), code: "1000", name: "Cash & Bank", type: "asset", openingBalance: "0", status: "Active", description: "", createdAt: new Date().toISOString() },
  { id: newId(), code: "1100", name: "Accounts Receivable", type: "asset", openingBalance: "0", status: "Active", description: "", createdAt: new Date().toISOString() },
  { id: newId(), code: "1200", name: "Inventory", type: "asset", openingBalance: "0", status: "Active", description: "", createdAt: new Date().toISOString() },
  { id: newId(), code: "2000", name: "Accounts Payable", type: "liability", openingBalance: "0", status: "Active", description: "", createdAt: new Date().toISOString() },
  { id: newId(), code: "2100", name: "Sales Tax Payable", type: "liability", openingBalance: "0", status: "Active", description: "", createdAt: new Date().toISOString() },
  { id: newId(), code: "3000", name: "Owner's Equity", type: "equity", openingBalance: "0", status: "Active", description: "", createdAt: new Date().toISOString() },
  { id: newId(), code: "4000", name: "Sales Revenue", type: "income", openingBalance: "0", status: "Active", description: "", createdAt: new Date().toISOString() },
  { id: newId(), code: "4100", name: "Other Income", type: "income", openingBalance: "0", status: "Active", description: "", createdAt: new Date().toISOString() },
  { id: newId(), code: "5000", name: "Cost of Goods Sold", type: "expense", openingBalance: "0", status: "Active", description: "", createdAt: new Date().toISOString() },
  { id: newId(), code: "5100", name: "Operating Expenses", type: "expense", openingBalance: "0", status: "Active", description: "", createdAt: new Date().toISOString() },
  { id: newId(), code: "5200", name: "Taxes", type: "expense", openingBalance: "0", status: "Active", description: "", createdAt: new Date().toISOString() },
];

type ChartOfAccountsState = {
  accounts: CoaAccount[];
  addAccount: (data: Omit<CoaAccount, "id" | "createdAt">) => void;
  updateAccount: (id: string, data: Omit<CoaAccount, "id" | "createdAt">) => void;
  deleteAccount: (id: string) => void;
  resetAccounts: () => void;
};

export const useChartOfAccountsStore = create<ChartOfAccountsState>()(
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
      name: "xmerge_chart_of_accounts",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
