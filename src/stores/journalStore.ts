"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const JOURNAL_STATUSES = ["Draft", "Posted"] as const;

export type JournalStatus = (typeof JOURNAL_STATUSES)[number];

export type JournalLine = {
  id: string;
  accountName: string;
  debit: string;
  credit: string;
};

export type JournalEntry = {
  id: string;
  journalNo: string;
  date: string;
  description: string;
  status: JournalStatus;
  lines: JournalLine[];
  createdAt: string;
};

const newId = (prefix = "je_") =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${prefix}${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const seedEntries = (): JournalEntry[] => [
  {
    id: newId(),
    journalNo: "JE-1001",
    date: daysFromNow(-3),
    description: "Owner's capital contribution",
    status: "Posted",
    lines: [
      { id: newId("l_"), accountName: "Cash & Bank", debit: "10000", credit: "" },
      { id: newId("l_"), accountName: "Owner's Equity", debit: "", credit: "10000" },
    ],
    createdAt: new Date().toISOString(),
  },
];

type JournalState = {
  entries: JournalEntry[];
  addEntry: (data: Omit<JournalEntry, "id" | "createdAt">) => void;
  updateEntry: (id: string, data: Omit<JournalEntry, "id" | "createdAt">) => void;
  deleteEntry: (id: string) => void;
  resetEntries: () => void;
};

export const useJournalStore = create<JournalState>()(
  persist(
    (set) => ({
      entries: seedEntries(),

      addEntry: (data) =>
        set((state) => ({
          entries: [
            { id: newId(), createdAt: new Date().toISOString(), ...data },
            ...state.entries,
          ],
        })),

      updateEntry: (id, data) =>
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id ? { ...entry, ...data } : entry
          ),
        })),

      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
        })),

      resetEntries: () => set({ entries: seedEntries() }),
    }),
    {
      name: "xmerge_journal_entries",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
