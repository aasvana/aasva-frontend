"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PurchaseOrderFormData } from "./schema";
import {
  deletePurchaseOrder,
  getPurchaseOrder,
  getPurchaseOrders,
  savePurchaseOrder,
  updatePurchaseOrder,
  reviveDates,
  SavedPurchaseOrder,
} from "./storage";
import { PURCHASE_ORDER_DRAFT_KEY } from "./constants";

const canUseWindow = typeof window !== "undefined";

interface PurchaseOrderStoreState {
  purchaseOrders: SavedPurchaseOrder[];
  ready: boolean;
  draft: PurchaseOrderFormData | null;
  previewOpen: boolean;
  hydrate: () => void;
  addPurchaseOrder: (data: PurchaseOrderFormData) => SavedPurchaseOrder;
  updatePurchaseOrderById: (
    id: string,
    data: PurchaseOrderFormData
  ) => SavedPurchaseOrder | undefined;
  deletePurchaseOrderById: (id: string) => void;
  getPurchaseOrderById: (id: string) => SavedPurchaseOrder | undefined;
  setDraft: (data: PurchaseOrderFormData) => void;
  clearDraft: () => void;
  openPreview: () => void;
  closePreview: () => void;
}

export const usePurchaseOrderStore = create<PurchaseOrderStoreState>()(
  persist(
    (set, get) => ({
      purchaseOrders: canUseWindow ? getPurchaseOrders() : [],
      ready: canUseWindow,
      draft: null,
      previewOpen: false,
      hydrate: () =>
        set({ purchaseOrders: getPurchaseOrders(), ready: true }),
      addPurchaseOrder: (data) => {
        const record = savePurchaseOrder(data);
        set((state) => ({
          purchaseOrders: [record, ...state.purchaseOrders],
        }));
        return record;
      },
      updatePurchaseOrderById: (id, data) => {
        const updated = updatePurchaseOrder(id, data);
        if (updated) {
          set((state) => ({
            purchaseOrders: state.purchaseOrders.map((record) =>
              record.id === id ? updated : record
            ),
          }));
        }
        return updated;
      },
      deletePurchaseOrderById: (id) => {
        deletePurchaseOrder(id);
        set((state) => ({
          purchaseOrders: state.purchaseOrders.filter(
            (record) => record.id !== id
          ),
        }));
      },
      getPurchaseOrderById: (id) =>
        get().purchaseOrders.find((record) => record.id === id) ??
        getPurchaseOrder(id),
      setDraft: (data) => set({ draft: data }),
      clearDraft: () => set({ draft: null }),
      openPreview: () => set({ previewOpen: true }),
      closePreview: () => set({ previewOpen: false }),
    }),
    {
      name: PURCHASE_ORDER_DRAFT_KEY,
      storage: createJSONStorage(() => localStorage, {
        reviver: reviveDates,
      }),
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);

export const usePurchaseOrderDraftStore = usePurchaseOrderStore;
