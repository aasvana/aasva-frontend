"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type SupplierCategory = "hotel" | "airline" | "transport" | "activity";

export const SUPPLIER_CATEGORIES: { value: SupplierCategory; label: string }[] =
  [
    { value: "hotel", label: "Hotel" },
    { value: "airline", label: "Airline" },
    { value: "transport", label: "Transport" },
    { value: "activity", label: "Activity" },
  ];

export const SUPPLIER_CATEGORY_LABEL: Record<SupplierCategory, string> = {
  hotel: "Hotel",
  airline: "Airline",
  transport: "Transport",
  activity: "Activity",
};

export type Supplier = {
  id: string;
  category: SupplierCategory;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  city: string;
  country: string;
  rating: string;
  notes: string;
  isActive: string;
  destinationId?: string;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `sup_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const seedSuppliers = (): Supplier[] => [
  /* hotel seeds are intentionally omitted; hotels come from shared master data */
  {
    id: newId(),
    category: "hotel",
    name: "Taj Mahal Palace",
    contactPerson: "Rahul Mehta",
    phone: "+91 22 6665 3366",
    email: "reservations@tajmahalpalace.com",
    city: "Mumbai",
    country: "India",
    rating: "5",
    notes: "Heritage hotel on Colaba waterfront.",
    isActive: "Yes",
  },
  {
    id: newId(),
    category: "hotel",
    name: "The Leela Palace",
    contactPerson: "Anita Kapoor",
    phone: "+91 11 3933 0000",
    email: "reservations@theleela.com",
    city: "New Delhi",
    country: "India",
    rating: "5",
    notes: "",
    isActive: "Yes",
  },
  {
    id: newId(),
    category: "airline",
    name: "Emirates",
    contactPerson: "Support Desk",
    phone: "+971 600 555 555",
    email: "bookings@emirates.com",
    city: "Dubai",
    country: "UAE",
    rating: "5",
    notes: "Direct flights to Europe and Middle East.",
    isActive: "Yes",
  },
  {
    id: newId(),
    category: "airline",
    name: "IndiGo",
    contactPerson: "Sales Team",
    phone: "+91 124 435 2500",
    email: "corporate@goindigo.in",
    city: "Gurugram",
    country: "India",
    rating: "4",
    notes: "",
    isActive: "Yes",
  },
  {
    id: newId(),
    category: "transport",
    name: "Hertz Rent a Car",
    contactPerson: "City Desk",
    phone: "+971 4 339 4422",
    email: "dubai@hertz.com",
    city: "Dubai",
    country: "UAE",
    rating: "4",
    notes: "Airport pickup available.",
    isActive: "Yes",
  },
  {
    id: newId(),
    category: "transport",
    name: "Big Red Bus",
    contactPerson: "Tours Desk",
    phone: "+44 20 7233 9533",
    email: "info@bigredbus.co.uk",
    city: "London",
    country: "United Kingdom",
    rating: "4",
    notes: "Hop-on hop-off city tours.",
    isActive: "No",
  },
  {
    id: newId(),
    category: "activity",
    name: "Desert Safari Dubai",
    contactPerson: "Activity Desk",
    phone: "+971 50 123 4567",
    email: "bookings@desertsafari.ae",
    city: "Dubai",
    country: "UAE",
    rating: "5",
    notes: "Evening dune bashing and BBQ.",
    isActive: "Yes",
  },
  {
    id: newId(),
    category: "activity",
    name: "Andaman Scuba Diving",
    contactPerson: "Dive Master",
    phone: "+91 9531 456 789",
    email: "dive@andamanscuba.in",
    city: "Port Blair",
    country: "India",
    rating: "4",
    notes: "Certified PADI centre.",
    isActive: "Yes",
  },
];

const seedNonHotelSuppliers = () =>
  seedSuppliers().filter((supplier) => supplier.category !== "hotel");

type SupplierState = {
  suppliers: Supplier[];
  addSupplier: (data: Omit<Supplier, "id">) => void;
  updateSupplier: (id: string, data: Omit<Supplier, "id">) => void;
  deleteSupplier: (id: string) => void;
  clearHotelSuppliers: () => void;
  resetSuppliers: () => void;
};

export const useSupplierStore = create<SupplierState>()(
  persist(
    (set) => ({
      suppliers: seedNonHotelSuppliers(),

      addSupplier: (data) =>
        set((state) => ({
          suppliers: [...state.suppliers, { id: newId(), ...data }],
        })),

      updateSupplier: (id, data) =>
        set((state) => ({
          suppliers: state.suppliers.map((supplier) =>
            supplier.id === id ? { ...supplier, ...data } : supplier
          ),
        })),

      deleteSupplier: (id) =>
        set((state) => ({
          suppliers: state.suppliers.filter(
            (supplier) => supplier.id !== id
          ),
        })),

      clearHotelSuppliers: () =>
        set((state) => ({
          suppliers: state.suppliers.filter((supplier) => supplier.category !== "hotel"),
        })),

      resetSuppliers: () => set({ suppliers: seedSuppliers() }),
    }),
    {
      name: "xmerge_travel_suppliers",
      version: 2,
      migrate: (persistedState) => {
        if (!persistedState || typeof persistedState !== "object") return persistedState;
        const state = persistedState as SupplierState;
        return {
          ...state,
          suppliers: Array.isArray(state.suppliers)
            ? state.suppliers.filter((supplier) => supplier.category !== "hotel")
            : [],
        };
      },
      storage: createJSONStorage(() => localStorage),
    }
  )
);
