"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SupplierCategory } from "./supplierStore";

export const ITINERARY_STATUSES = [
  "Draft",
  "Confirmed",
  "Completed",
  "Cancelled",
] as const;

export type ItineraryStatus = (typeof ITINERARY_STATUSES)[number];

export type ItineraryItem = {
  id: string;
  day: string;
  category: SupplierCategory;
  title: string;
  location: string;
  description: string;
};

export type Itinerary = {
  id: string;
  title: string;
  customerId: string;
  customerName: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: ItineraryStatus;
  notes: string;
  items: ItineraryItem[];
  createdAt: string;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `itn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const seedItineraries = (): Itinerary[] => [
  {
    id: newId(),
    title: "Dubai Family Getaway",
    customerId: "",
    customerName: "Jane Cooper",
    destination: "Dubai",
    startDate: daysFromNow(45),
    endDate: daysFromNow(52),
    status: "Draft",
    notes: "Family of four, beach + desert mix.",
    items: [
      {
        id: newId(),
        day: "1",
        category: "hotel",
        title: "Check-in at Atlantis",
        location: "Palm Jumeirah",
        description: "Deluxe room, sea view.",
      },
      {
        id: newId(),
        day: "2",
        category: "activity",
        title: "Desert safari",
        location: "Dubai Desert",
        description: "Dune bashing, BBQ dinner and show.",
      },
      {
        id: newId(),
        day: "3",
        category: "activity",
        title: "Burj Khalifa sunset",
        location: "Downtown Dubai",
        description: "At the Top sky lounge, evening slot.",
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

type ItineraryState = {
  itineraries: Itinerary[];
  addItinerary: (data: Omit<Itinerary, "id" | "createdAt">) => void;
  updateItinerary: (id: string, data: Omit<Itinerary, "id" | "createdAt">) => void;
  deleteItinerary: (id: string) => void;
  resetItineraries: () => void;
};

export const useItineraryStore = create<ItineraryState>()(
  persist(
    (set) => ({
      itineraries: seedItineraries(),

      addItinerary: (data) =>
        set((state) => ({
          itineraries: [
            { id: newId(), createdAt: new Date().toISOString(), ...data },
            ...state.itineraries,
          ],
        })),

      updateItinerary: (id, data) =>
        set((state) => ({
          itineraries: state.itineraries.map((itinerary) =>
            itinerary.id === id ? { ...itinerary, ...data } : itinerary
          ),
        })),

      deleteItinerary: (id) =>
        set((state) => ({
          itineraries: state.itineraries.filter(
            (itinerary) => itinerary.id !== id
          ),
        })),

      resetItineraries: () => set({ itineraries: seedItineraries() }),
    }),
    {
      name: "xmerge_travel_itineraries",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
