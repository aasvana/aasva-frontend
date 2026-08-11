"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const ADJUSTMENT_REASONS = [
  "Restock",
  "Damaged",
  "Returned",
  "Recount",
  "Sample",
  "Other",
] as const;

export type AdjustmentReason = (typeof ADJUSTMENT_REASONS)[number];

export type StockAdjustment = {
  id: string;
  productId: string;
  productName: string;
  outletId: string;
  outletName: string;
  delta: number;
  reason: string;
  note: string;
  createdAt: string;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `adj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

type StockAdjustmentState = {
  adjustments: StockAdjustment[];
  addAdjustment: (data: Omit<StockAdjustment, "id" | "createdAt">) => void;
  deleteAdjustment: (id: string) => void;
  clearAdjustments: () => void;
};

export const useStockAdjustmentStore = create<StockAdjustmentState>()(
  persist(
    (set) => ({
      adjustments: [],

      addAdjustment: (data) =>
        set((state) => ({
          adjustments: [
            { ...data, id: newId(), createdAt: new Date().toISOString() },
            ...state.adjustments,
          ],
        })),

      deleteAdjustment: (id) =>
        set((state) => ({
          adjustments: state.adjustments.filter((a) => a.id !== id),
        })),

      clearAdjustments: () => set({ adjustments: [] }),
    }),
    {
      name: "xmerge_stock_adjustments",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
