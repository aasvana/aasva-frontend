"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const TAX_TYPES = ["sales", "purchase", "both"] as const;

export type TaxType = (typeof TAX_TYPES)[number];

export const TAX_TYPE_LABELS: Record<TaxType, string> = {
  sales: "Sales",
  purchase: "Purchase",
  both: "Sales & Purchase",
};

export type TaxRate = {
  id: string;
  name: string;
  rate: string;
  type: TaxType;
  isDefault: boolean;
  status: "Active" | "Inactive";
  description: string;
  createdAt: string;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `tax_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const seedTaxRates = (): TaxRate[] => [
  { id: newId(), name: "Zero Rated", rate: "0", type: "both", isDefault: true, status: "Active", description: "No tax applied.", createdAt: new Date().toISOString() },
  { id: newId(), name: "Standard VAT", rate: "20", type: "both", isDefault: false, status: "Active", description: "Default standard rate.", createdAt: new Date().toISOString() },
  { id: newId(), name: "Reduced VAT", rate: "8", type: "both", isDefault: false, status: "Active", description: "Reduced rate for essentials.", createdAt: new Date().toISOString() },
];

type TaxState = {
  rates: TaxRate[];
  addRate: (data: Omit<TaxRate, "id" | "createdAt">) => void;
  updateRate: (id: string, data: Omit<TaxRate, "id" | "createdAt">) => void;
  deleteRate: (id: string) => void;
  resetRates: () => void;
};

export const useTaxStore = create<TaxState>()(
  persist(
    (set) => ({
      rates: seedTaxRates(),

      addRate: (data) =>
        set((state) => ({
          rates: [
            { id: newId(), createdAt: new Date().toISOString(), ...data },
            ...state.rates,
          ],
        })),

      updateRate: (id, data) =>
        set((state) => ({
          rates: state.rates.map((rate) =>
            rate.id === id ? { ...rate, ...data } : rate
          ),
        })),

      deleteRate: (id) =>
        set((state) => ({
          rates: state.rates.filter((rate) => rate.id !== id),
        })),

      resetRates: () => set({ rates: seedTaxRates() }),
    }),
    {
      name: "xmerge_tax_rates",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
