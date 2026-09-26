"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { createTenantStorage, registerTenantScopedStore } from "@/lib/tenant-storage";

export const DOCUMENT_CATEGORIES = [
  "Passport",
  "Visa",
  "Ticket",
  "Voucher",
  "Insurance",
  "Other",
] as const;

export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

export type TravelDocument = {
  id: string;
  name: string;
  category: DocumentCategory;
  reference: string;
  relatedTo: string;
  expiresOn: string;
  notes: string;
  createdAt: string;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `doc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const seedDocuments = (): TravelDocument[] => [
  {
    id: newId(),
    name: "Jane Cooper Passport",
    category: "Passport",
    reference: "P12345678",
    relatedTo: "Jane Cooper",
    expiresOn: daysFromNow(210),
    notes: "Biometric passport.",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId(),
    name: "UAE Tourist Visa",
    category: "Visa",
    reference: "VISA-2026-8821",
    relatedTo: "Jane Cooper",
    expiresOn: daysFromNow(70),
    notes: "30-day single entry.",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId(),
    name: "Travel Insurance",
    category: "Insurance",
    reference: "INS-4455-2201",
    relatedTo: "Dubai Family Getaway",
    expiresOn: daysFromNow(95),
    notes: "Covers the full trip window.",
    createdAt: new Date().toISOString(),
  },
];

type TravelDocumentState = {
  documents: TravelDocument[];
  addDocument: (data: Omit<TravelDocument, "id">) => void;
  updateDocument: (id: string, data: Omit<TravelDocument, "id">) => void;
  deleteDocument: (id: string) => void;
  resetDocuments: () => void;
};

export const useTravelDocumentStore = create<TravelDocumentState>()(
  persist(
    (set) => ({
      documents: seedDocuments(),

      addDocument: (data) =>
        set((state) => ({
          documents: [{ id: newId(), ...data }, ...state.documents],
        })),

      updateDocument: (id, data) =>
        set((state) => ({
          documents: state.documents.map((document) =>
            document.id === id ? { ...document, ...data } : document
          ),
        })),

      deleteDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((document) => document.id !== id),
        })),

      resetDocuments: () => set({ documents: seedDocuments() }),
    }),
    {
      name: "xmerge_travel_documents",
      storage: createJSONStorage(() => createTenantStorage()),
    }
  )
);

registerTenantScopedStore(() => {
  void useTravelDocumentStore.persist.rehydrate();
});
