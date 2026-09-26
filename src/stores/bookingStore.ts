"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SupplierCategory } from "./supplierStore";
import { createTenantStorage, registerTenantScopedStore } from "@/lib/tenant-storage";

export const BOOKING_STATUSES = [
  "Pending",
  "Confirmed",
  "Cancelled",
  "Completed",
] as const;

export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type Booking = {
  id: string;
  reference: string;
  customerId: string;
  customerName: string;
  category: SupplierCategory;
  supplierId: string;
  supplierName: string;
  service: string;
  startDate: string;
  endDate: string;
  pax: string;
  amount: string;
  currency: string;
  status: BookingStatus;
  notes: string;
  createdAt: string;
};

const newId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `bk_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const daysFromNow = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
};

const seedBookings = (): Booking[] => [
  {
    id: newId(),
    reference: "BK-1001",
    customerId: "",
    customerName: "Theo Nguyen",
    category: "hotel",
    supplierId: "",
    supplierName: "Taj Mahal Palace",
    service: "Deluxe Room (2 nights)",
    startDate: daysFromNow(20),
    endDate: daysFromNow(22),
    pax: "2",
    amount: "620",
    currency: "USD",
    status: "Confirmed",
    notes: "Late checkout requested.",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId(),
    reference: "BK-1002",
    customerId: "",
    customerName: "Alicia Reyes",
    category: "airline",
    supplierId: "",
    supplierName: "Emirates",
    service: "Dubai → Male, return",
    startDate: daysFromNow(80),
    endDate: daysFromNow(87),
    pax: "2",
    amount: "980",
    currency: "USD",
    status: "Pending",
    notes: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId(),
    reference: "BK-1003",
    customerId: "",
    customerName: "Jane Cooper",
    category: "activity",
    supplierId: "",
    supplierName: "Desert Safari Dubai",
    service: "Evening safari (4 pax)",
    startDate: daysFromNow(46),
    endDate: daysFromNow(46),
    pax: "4",
    amount: "240",
    currency: "USD",
    status: "Pending",
    notes: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: newId(),
    reference: "BK-1004",
    customerId: "",
    customerName: "Marcus Chen",
    category: "transport",
    supplierId: "",
    supplierName: "Hertz Rent a Car",
    service: "Compact car (5 days)",
    startDate: daysFromNow(9),
    endDate: daysFromNow(14),
    pax: "2",
    amount: "210",
    currency: "USD",
    status: "Completed",
    notes: "",
    createdAt: new Date().toISOString(),
  },
];

type BookingState = {
  bookings: Booking[];
  addBooking: (data: Omit<Booking, "id" | "createdAt">) => void;
  updateBooking: (id: string, data: Omit<Booking, "id" | "createdAt">) => void;
  deleteBooking: (id: string) => void;
  resetBookings: () => void;
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      bookings: seedBookings(),

      addBooking: (data) =>
        set((state) => ({
          bookings: [
            { id: newId(), createdAt: new Date().toISOString(), ...data },
            ...state.bookings,
          ],
        })),

      updateBooking: (id, data) =>
        set((state) => ({
          bookings: state.bookings.map((booking) =>
            booking.id === id ? { ...booking, ...data } : booking
          ),
        })),

      deleteBooking: (id) =>
        set((state) => ({
          bookings: state.bookings.filter((booking) => booking.id !== id),
        })),

      resetBookings: () => set({ bookings: seedBookings() }),
    }),
    {
      name: "xmerge_travel_bookings",
      storage: createJSONStorage(() => createTenantStorage()),
    }
  )
);

registerTenantScopedStore(() => {
  void useBookingStore.persist.rehydrate();
});
