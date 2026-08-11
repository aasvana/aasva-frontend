"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DeliveryNoteFormData } from "./schema";
import {
  deleteDeliveryNote,
  getDeliveryNote,
  getDeliveryNotes,
  saveDeliveryNote,
  updateDeliveryNote,
  reviveDates,
  SavedDeliveryNote,
} from "./storage";
import { DELIVERY_NOTE_DRAFT_KEY } from "./constants";

const canUseWindow = typeof window !== "undefined";

interface DeliveryNoteStoreState {
  deliveryNotes: SavedDeliveryNote[];
  ready: boolean;
  draft: DeliveryNoteFormData | null;
  previewOpen: boolean;
  hydrate: () => void;
  addDeliveryNote: (data: DeliveryNoteFormData) => SavedDeliveryNote;
  updateDeliveryNoteById: (
    id: string,
    data: DeliveryNoteFormData
  ) => SavedDeliveryNote | undefined;
  deleteDeliveryNoteById: (id: string) => void;
  getDeliveryNoteById: (id: string) => SavedDeliveryNote | undefined;
  setDraft: (data: DeliveryNoteFormData) => void;
  clearDraft: () => void;
  openPreview: () => void;
  closePreview: () => void;
}

export const useDeliveryNoteStore = create<DeliveryNoteStoreState>()(
  persist(
    (set, get) => ({
      deliveryNotes: canUseWindow ? getDeliveryNotes() : [],
      ready: canUseWindow,
      draft: null,
      previewOpen: false,
      hydrate: () =>
        set({ deliveryNotes: getDeliveryNotes(), ready: true }),
      addDeliveryNote: (data) => {
        const record = saveDeliveryNote(data);
        set((state) => ({
          deliveryNotes: [record, ...state.deliveryNotes],
        }));
        return record;
      },
      updateDeliveryNoteById: (id, data) => {
        const updated = updateDeliveryNote(id, data);
        if (updated) {
          set((state) => ({
            deliveryNotes: state.deliveryNotes.map((record) =>
              record.id === id ? updated : record
            ),
          }));
        }
        return updated;
      },
      deleteDeliveryNoteById: (id) => {
        deleteDeliveryNote(id);
        set((state) => ({
          deliveryNotes: state.deliveryNotes.filter(
            (record) => record.id !== id
          ),
        }));
      },
      getDeliveryNoteById: (id) =>
        get().deliveryNotes.find((record) => record.id === id) ??
        getDeliveryNote(id),
      setDraft: (data) => set({ draft: data }),
      clearDraft: () => set({ draft: null }),
      openPreview: () => set({ previewOpen: true }),
      closePreview: () => set({ previewOpen: false }),
    }),
    {
      name: DELIVERY_NOTE_DRAFT_KEY,
      storage: createJSONStorage(() => localStorage, {
        reviver: reviveDates,
      }),
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);

export const useDeliveryNoteDraftStore = useDeliveryNoteStore;
