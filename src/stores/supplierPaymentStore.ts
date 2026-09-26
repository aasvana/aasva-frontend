"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createTenantStorage, registerTenantScopedStore } from "@/lib/tenant-storage";

export const SUPPLIER_PAYMENT_MODES = [
  "Bank Transfer",
  "Cash",
  "Cheque",
  "Card",
] as const;

export const SUPPLIER_PAYMENT_STATUSES = [
  "Pending",
  "Paid",
  "Failed",
] as const;

export type SupplierPaymentStatus = (typeof SUPPLIER_PAYMENT_STATUSES)[number];

export type SupplierPayment = {
  id: string;
  paymentNo: string;
  vendor: string;
  date: string;
  amount: string;
  mode: (typeof SUPPLIER_PAYMENT_MODES)[number];
  status: SupplierPaymentStatus;
  notes: string;
  createdAt: string;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `sp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const seedSupplierPayments = (): SupplierPayment[] => [
  {
    id: newId(),
    paymentNo: "PY-1001",
    vendor: "City Power & Utilities",
    date: daysFromNow(-2),
    amount: "312",
    mode: "Bank Transfer",
    status: "Paid",
    notes: "BILL-1003",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId(),
    paymentNo: "PY-1002",
    vendor: "Brightworks Web Hosting",
    date: daysFromNow(3),
    amount: "240",
    mode: "Bank Transfer",
    status: "Pending",
    notes: "BILL-1002",
    createdAt: new Date().toISOString(),
  },
];

type SupplierPaymentState = {
  payments: SupplierPayment[];
  addPayment: (data: Omit<SupplierPayment, "id" | "createdAt">) => void;
  updatePayment: (id: string, data: Omit<SupplierPayment, "id" | "createdAt">) => void;
  deletePayment: (id: string) => void;
  resetPayments: () => void;
};

export const useSupplierPaymentStore = create<SupplierPaymentState>()(
  persist(
    (set) => ({
      payments: seedSupplierPayments(),

      addPayment: (data) =>
        set((state) => ({
          payments: [
            { id: newId(), createdAt: new Date().toISOString(), ...data },
            ...state.payments,
          ],
        })),

      updatePayment: (id, data) =>
        set((state) => ({
          payments: state.payments.map((payment) =>
            payment.id === id ? { ...payment, ...data } : payment
          ),
        })),

      deletePayment: (id) =>
        set((state) => ({
          payments: state.payments.filter((payment) => payment.id !== id),
        })),

      resetPayments: () => set({ payments: seedSupplierPayments() }),
    }),
    {
      name: "xmerge_supplier_payments",
      storage: createJSONStorage(() => createTenantStorage()),
    }
  )
);

registerTenantScopedStore(() => {
  void useSupplierPaymentStore.persist.rehydrate();
});
