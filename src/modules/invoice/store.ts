"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { InvoiceFormData } from "./schema";
import {
  deleteInvoice,
  getInvoice,
  getInvoices,
  saveInvoice,
  updateInvoice,
  reviveDates,
  SavedInvoice,
} from "./storage";

const canUseWindow = typeof window !== "undefined";

interface InvoiceStoreState {
  invoices: SavedInvoice[];
  ready: boolean;
  draft: InvoiceFormData | null;
  previewOpen: boolean;
  hydrate: () => void;
  addInvoice: (data: InvoiceFormData) => SavedInvoice;
  updateInvoiceById: (
    id: string,
    data: InvoiceFormData
  ) => SavedInvoice | undefined;
  deleteInvoiceById: (id: string) => void;
  getInvoiceById: (id: string) => SavedInvoice | undefined;
  setDraft: (data: InvoiceFormData) => void;
  clearDraft: () => void;
  openPreview: () => void;
  closePreview: () => void;
}

export const useInvoiceStore = create<InvoiceStoreState>()(
  persist(
    (set, get) => ({
      invoices: canUseWindow ? getInvoices() : [],
      ready: canUseWindow,
      draft: null,
      previewOpen: false,
      hydrate: () => set({ invoices: getInvoices(), ready: true }),
      addInvoice: (data) => {
        const record = saveInvoice(data);
        set((state) => ({ invoices: [record, ...state.invoices] }));
        return record;
      },
      updateInvoiceById: (id, data) => {
        const updated = updateInvoice(id, data);
        if (updated) {
          set((state) => ({
            invoices: state.invoices.map((record) =>
              record.id === id ? updated : record
            ),
          }));
        }
        return updated;
      },
      deleteInvoiceById: (id) => {
        deleteInvoice(id);
        set((state) => ({
          invoices: state.invoices.filter((record) => record.id !== id),
        }));
      },
      getInvoiceById: (id) =>
        get().invoices.find((record) => record.id === id) ?? getInvoice(id),
      setDraft: (data) => set({ draft: data }),
      clearDraft: () => set({ draft: null }),
      openPreview: () => set({ previewOpen: true }),
      closePreview: () => set({ previewOpen: false }),
    }),
    {
      name: "xmerge_invoice_draft",
      storage: createJSONStorage(() => localStorage, {
        reviver: reviveDates,
      }),
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);

export const useInvoiceDraftStore = useInvoiceStore;
