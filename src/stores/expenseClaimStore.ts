"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const EXPENSE_CLAIM_CATEGORIES = [
  "Travel",
  "Meals",
  "Accommodation",
  "Fuel",
  "Office",
  "Other",
] as const;

export const EXPENSE_CLAIM_STATUSES = [
  "Submitted",
  "Approved",
  "Reimbursed",
  "Rejected",
] as const;

export type ExpenseClaimStatus = (typeof EXPENSE_CLAIM_STATUSES)[number];

export type ExpenseClaim = {
  id: string;
  claimNo: string;
  employee: string;
  date: string;
  category: (typeof EXPENSE_CLAIM_CATEGORIES)[number];
  amount: string;
  status: ExpenseClaimStatus;
  notes: string;
  createdAt: string;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `ec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const seedExpenseClaims = (): ExpenseClaim[] => [
  {
    id: newId(),
    claimNo: "EC-1001",
    employee: "Alicia Reyes",
    date: daysFromNow(-4),
    category: "Travel",
    amount: "185",
    status: "Submitted",
    notes: "Client meeting in the city.",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId(),
    claimNo: "EC-1002",
    employee: "Marcus Chen",
    date: daysFromNow(-9),
    category: "Meals",
    amount: "64",
    status: "Approved",
    notes: "Team lunch.",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId(),
    claimNo: "EC-1003",
    employee: "Jane Cooper",
    date: daysFromNow(-15),
    category: "Fuel",
    amount: "40",
    status: "Reimbursed",
    notes: "Errand runs.",
    createdAt: new Date().toISOString(),
  },
];

type ExpenseClaimState = {
  claims: ExpenseClaim[];
  addClaim: (data: Omit<ExpenseClaim, "id" | "createdAt">) => void;
  updateClaim: (id: string, data: Omit<ExpenseClaim, "id" | "createdAt">) => void;
  deleteClaim: (id: string) => void;
  resetClaims: () => void;
};

export const useExpenseClaimStore = create<ExpenseClaimState>()(
  persist(
    (set) => ({
      claims: seedExpenseClaims(),

      addClaim: (data) =>
        set((state) => ({
          claims: [
            { id: newId(), createdAt: new Date().toISOString(), ...data },
            ...state.claims,
          ],
        })),

      updateClaim: (id, data) =>
        set((state) => ({
          claims: state.claims.map((claim) =>
            claim.id === id ? { ...claim, ...data } : claim
          ),
        })),

      deleteClaim: (id) =>
        set((state) => ({
          claims: state.claims.filter((claim) => claim.id !== id),
        })),

      resetClaims: () => set({ claims: seedExpenseClaims() }),
    }),
    {
      name: "xmerge_expense_claims",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
