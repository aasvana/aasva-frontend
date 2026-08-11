"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type StockTransfer = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  fromOutletId: string;
  fromOutletName: string;
  toOutletId: string;
  toOutletName: string;
  qty: number;
  note: string;
  createdAt: string;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `trf_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

type StockTransferState = {
  transfers: StockTransfer[];
  addTransfer: (data: Omit<StockTransfer, "id" | "createdAt">) => void;
  deleteTransfer: (id: string) => void;
  clearTransfers: () => void;
};

export const useStockTransferStore = create<StockTransferState>()(
  persist(
    (set) => ({
      transfers: [],

      addTransfer: (data) =>
        set((state) => ({
          transfers: [
            { ...data, id: newId(), createdAt: new Date().toISOString() },
            ...state.transfers,
          ],
        })),

      deleteTransfer: (id) =>
        set((state) => ({
          transfers: state.transfers.filter((t) => t.id !== id),
        })),

      clearTransfers: () => set({ transfers: [] }),
    }),
    {
      name: "xmerge_stock_transfers",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
