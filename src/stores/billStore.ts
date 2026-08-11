"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const BILL_STATUSES = [
  "Pending",
  "Approved",
  "Paid",
  "Cancelled",
] as const;

export type BillStatus = (typeof BILL_STATUSES)[number];

export type Bill = {
  id: string;
  billNo: string;
  vendor: string;
  date: string;
  dueDate: string;
  category: string;
  amount: string;
  status: BillStatus;
  notes: string;
  createdAt: string;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `bill_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const seedBills = (): Bill[] => [
  {
    id: newId(),
    billNo: "BILL-1001",
    vendor: "Office Staple Supplies",
    date: daysFromNow(-6),
    dueDate: daysFromNow(9),
    category: "Office Supplies",
    amount: "480",
    status: "Pending",
    notes: "Printer paper and stationery.",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId(),
    billNo: "BILL-1002",
    vendor: "Brightworks Web Hosting",
    date: daysFromNow(-3),
    dueDate: daysFromNow(12),
    category: "Software & IT",
    amount: "240",
    status: "Approved",
    notes: "Annual hosting renewal.",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId(),
    billNo: "BILL-1003",
    vendor: "City Power & Utilities",
    date: daysFromNow(-12),
    dueDate: daysFromNow(-4),
    category: "Utilities",
    amount: "312",
    status: "Paid",
    notes: "Electricity bill.",
    createdAt: new Date().toISOString(),
  },
];

type BillState = {
  bills: Bill[];
  addBill: (data: Omit<Bill, "id" | "createdAt">) => void;
  updateBill: (id: string, data: Omit<Bill, "id" | "createdAt">) => void;
  deleteBill: (id: string) => void;
  resetBills: () => void;
};

export const useBillStore = create<BillState>()(
  persist(
    (set) => ({
      bills: seedBills(),

      addBill: (data) =>
        set((state) => ({
          bills: [
            { id: newId(), createdAt: new Date().toISOString(), ...data },
            ...state.bills,
          ],
        })),

      updateBill: (id, data) =>
        set((state) => ({
          bills: state.bills.map((bill) =>
            bill.id === id ? { ...bill, ...data } : bill
          ),
        })),

      deleteBill: (id) =>
        set((state) => ({
          bills: state.bills.filter((bill) => bill.id !== id),
        })),

      resetBills: () => set({ bills: seedBills() }),
    }),
    {
      name: "xmerge_bills",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
