"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createTenantStorage, registerTenantScopedStore } from "@/lib/tenant-storage";

export const BANK_TRANSACTION_TYPES = ["inflow", "outflow"] as const;

export type BankTransactionType = (typeof BANK_TRANSACTION_TYPES)[number];

export const BANK_TRANSACTION_CATEGORIES = [
  "Sales",
  "Customer Payment",
  "Supplier Payment",
  "Bills",
  "Transfer",
  "Fees",
  "Interest",
  "Other",
] as const;

export type BankTransaction = {
  id: string;
  accountId: string;
  accountName: string;
  date: string;
  type: BankTransactionType;
  description: string;
  category: string;
  amount: string;
  reconciled: boolean;
  createdAt: string;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `bt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const seedTransactions = (): BankTransaction[] => [
  {
    id: newId(),
    accountId: "",
    accountName: "Business Checking",
    date: daysFromNow(-1),
    type: "inflow",
    description: "Customer payment — Acme Corp",
    category: "Customer Payment",
    amount: "1500",
    reconciled: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: newId(),
    accountId: "",
    accountName: "Business Checking",
    date: daysFromNow(-3),
    type: "outflow",
    description: "Monthly bank service fee",
    category: "Fees",
    amount: "25",
    reconciled: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: newId(),
    accountId: "",
    accountName: "Petty Cash",
    date: daysFromNow(-2),
    type: "outflow",
    description: "Office snacks restock",
    category: "Other",
    amount: "48",
    reconciled: false,
    createdAt: new Date().toISOString(),
  },
];

type BankTransactionState = {
  transactions: BankTransaction[];
  addTransaction: (data: Omit<BankTransaction, "id" | "createdAt">) => void;
  updateTransaction: (
    id: string,
    data: Omit<BankTransaction, "id" | "createdAt">
  ) => void;
  deleteTransaction: (id: string) => void;
  setReconciled: (id: string, reconciled: boolean) => void;
  resetTransactions: () => void;
};

export const useBankTransactionStore = create<BankTransactionState>()(
  persist(
    (set) => ({
      transactions: seedTransactions(),

      addTransaction: (data) =>
        set((state) => ({
          transactions: [
            { id: newId(), createdAt: new Date().toISOString(), ...data },
            ...state.transactions,
          ],
        })),

      updateTransaction: (id, data) =>
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === id ? { ...transaction, ...data } : transaction
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter(
            (transaction) => transaction.id !== id
          ),
        })),

      setReconciled: (id, reconciled) =>
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === id ? { ...transaction, reconciled } : transaction
          ),
        })),

      resetTransactions: () => set({ transactions: seedTransactions() }),
    }),
    {
      name: "xmerge_bank_transactions",
      storage: createJSONStorage(() => createTenantStorage()),
    }
  )
);

registerTenantScopedStore(() => {
  void useBankTransactionStore.persist.rehydrate();
});
