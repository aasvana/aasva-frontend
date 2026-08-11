"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const NUMBERING_DOCS = [
  "estimate",
  "invoice",
  "salesOrder",
  "deliveryNote",
  "purchaseOrder",
  "bill",
  "receipt",
  "creditNote",
  "debitNote",
  "supplierPayment",
  "expense",
  "expenseClaim",
  "journal",
] as const;

export type NumberingDoc = (typeof NUMBERING_DOCS)[number];

export const DEFAULT_NUMBERING: Record<NumberingDoc, { prefix: string; next: string }> = {
  estimate: { prefix: "EST-", next: "1001" },
  invoice: { prefix: "INV-", next: "1001" },
  salesOrder: { prefix: "SO-", next: "1001" },
  deliveryNote: { prefix: "DN-", next: "1001" },
  purchaseOrder: { prefix: "PO-", next: "1001" },
  bill: { prefix: "BILL-", next: "1001" },
  receipt: { prefix: "RCPT-", next: "1001" },
  creditNote: { prefix: "CN-", next: "1001" },
  debitNote: { prefix: "DNB-", next: "1001" },
  supplierPayment: { prefix: "PY-", next: "1001" },
  expense: { prefix: "EXP-", next: "1001" },
  expenseClaim: { prefix: "EC-", next: "1001" },
  journal: { prefix: "JE-", next: "1001" },
};

export const NUMBERING_LABELS: Record<NumberingDoc, string> = {
  estimate: "Estimates",
  invoice: "Invoices",
  salesOrder: "Sales Orders",
  deliveryNote: "Delivery Notes",
  purchaseOrder: "Purchase Orders",
  bill: "Bills",
  receipt: "Receipts",
  creditNote: "Credit Notes",
  debitNote: "Debit Notes",
  supplierPayment: "Supplier Payments",
  expense: "Expenses",
  expenseClaim: "Expense Claims",
  journal: "Journal Entries",
};

export type PaymentTerm = {
  id: string;
  name: string;
  days: string;
  description: string;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `pt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const seedPaymentTerms = (): PaymentTerm[] => [
  { id: newId(), name: "Due on Receipt", days: "0", description: "Payment due immediately." },
  { id: newId(), name: "Net 15", days: "15", description: "Payment due within 15 days." },
  { id: newId(), name: "Net 30", days: "30", description: "Payment due within 30 days." },
];

type AccountSettingsState = {
  general: {
    defaultCurrency: string;
    fiscalYearStart: string;
    taxId: string;
    enableBankSync: boolean;
  };
  invoice: {
    defaultPaymentMode: string;
    includeCompany: boolean;
    defaultTerms: string;
  };
  numbering: Record<NumberingDoc, { prefix: string; next: string }>;
  paymentTerms: PaymentTerm[];
  updateGeneral: (patch: Partial<AccountSettingsState["general"]>) => void;
  updateInvoice: (patch: Partial<AccountSettingsState["invoice"]>) => void;
  updateNumbering: (doc: NumberingDoc, patch: { prefix?: string; next?: string }) => void;
  addPaymentTerm: (data: Omit<PaymentTerm, "id">) => void;
  updatePaymentTerm: (id: string, data: Omit<PaymentTerm, "id">) => void;
  deletePaymentTerm: (id: string) => void;
  reset: () => void;
};

const initialState = {
  general: {
    defaultCurrency: "USD",
    fiscalYearStart: "January",
    taxId: "",
    enableBankSync: false,
  },
  invoice: {
    defaultPaymentMode: "bank_transfer",
    includeCompany: false,
    defaultTerms: "Payment due within 30 days of the invoice date.",
  },
  numbering: DEFAULT_NUMBERING,
  paymentTerms: seedPaymentTerms(),
};

export const useAccountSettingsStore = create<AccountSettingsState>()(
  persist(
    (set) => ({
      ...initialState,

      updateGeneral: (patch) =>
        set((state) => ({ general: { ...state.general, ...patch } })),

      updateInvoice: (patch) =>
        set((state) => ({ invoice: { ...state.invoice, ...patch } })),

      updateNumbering: (doc, patch) =>
        set((state) => ({
          numbering: {
            ...state.numbering,
            [doc]: { ...state.numbering[doc], ...patch },
          },
        })),

      addPaymentTerm: (data) =>
        set((state) => ({
          paymentTerms: [...state.paymentTerms, { id: newId(), ...data }],
        })),

      updatePaymentTerm: (id, data) =>
        set((state) => ({
          paymentTerms: state.paymentTerms.map((term) =>
            term.id === id ? { ...term, ...data } : term
          ),
        })),

      deletePaymentTerm: (id) =>
        set((state) => ({
          paymentTerms: state.paymentTerms.filter((term) => term.id !== id),
        })),

      reset: () => set({ ...initialState }),
    }),
    {
      name: "xmerge_account_settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
